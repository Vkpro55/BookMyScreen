import createHttpError from "http-errors";
import prisma, {
  BookingStatus,
  PaymentOrderStatus,
  SeatStatus,
} from "@repo/db/client";
import type { Prisma } from "@repo/db/client";
import type { CreateBookingInput } from "./booking.types.js";
import redis from "../../config/redis.js";

const bookingInclude = {
  bookingFee: true,
  paymentOrder: true,
  show: {
    include: {
      movie: true,
      screen: {
        include: {
          theater: true,
        },
      },
    },
  },
} as const;

type BookingWithDetails = Prisma.BookingGetPayload<{
  include: typeof bookingInclude;
}>;

const createBookingRef = (): string => {
  return `BMS${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

const toBookingResponse = (booking: BookingWithDetails) => ({
  id: booking.id,
  bookingRef: booking.bookingRef,
  status: booking.status,
  seats: booking.seats,
  bookingDateTime: booking.bookingDateTime,
  paymentMethod: booking.paymentMethod,
  payment: {
    amount: booking.paymentOrder.amount,
    currency: booking.paymentOrder.currency,
    status: booking.paymentOrder.status,
    razorpayOrderId: booking.paymentOrder.razorpayOrderId,
    razorpayPaymentId: booking.paymentOrder.razorpayPaymentId,
  },
  fee: booking.bookingFee
    ? {
        ticketPrice: booking.bookingFee.ticketPrice,
        convenience: booking.bookingFee.convenience,
        total: booking.bookingFee.total,
      }
    : null,
  show: {
    id: booking.show.id,
    startTime: booking.show.startTime,
    format: booking.show.format,
    audioType: booking.show.audioType,
    movie: booking.show.movie,
    screen: {
      id: booking.show.screen.id,
      name: booking.show.screen.name,
      theater: booking.show.screen.theater,
    },
  },
});

const getExistingBookingByPaymentOrderId = async (paymentOrderId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { paymentOrderId },
    include: bookingInclude,
  });

  return booking ? toBookingResponse(booking) : null;
};

export const createBooking = async (
  userId: string,
  input: CreateBookingInput,
) => {
  const uniqueSeatIds = [...new Set(input.seats.map((seat) => seat.seatId))];

  if (uniqueSeatIds.length !== input.seats.length) {
    throw createHttpError(400, "Duplicate seats are not allowed");
  }

  const paymentOrder = await prisma.paymentOrder.findFirst({
    where: {
      OR: [
        { razorpayOrderId: input.razorpayOrderId },
        { id: input.razorpayOrderId },
      ],
    },
  });

  if (!paymentOrder) {
    throw createHttpError(404, "Payment order not found");
  }

  const existingBooking = await getExistingBookingByPaymentOrderId(
    paymentOrder.id,
  );

  if (existingBooking) {
    return existingBooking;
  }

  if (
    paymentOrder.status !== PaymentOrderStatus.PAID &&
    paymentOrder.status !== PaymentOrderStatus.AUTHORIZED
  ) {
    throw createHttpError(409, "Payment is not confirmed yet");
  }

  const show = await prisma.show.findUnique({
    where: { id: input.showId },
    include: {
      showSeats: {
        where: {
          seatId: { in: uniqueSeatIds },
        },
        include: {
          seat: {
            include: {
              row: true,
            },
          },
        },
      },
    },
  });

  if (!show) {
    throw createHttpError(404, "Show not found");
  }

  if (show.showSeats.length !== uniqueSeatIds.length) {
    throw createHttpError(400, "One or more seats do not belong to this show");
  }

  const priceMap = show.priceMap as Record<string, number>;
  const ticketPrice = show.showSeats.reduce((sum, showSeat) => {
    const price = priceMap[showSeat.seat.row.label];

    if (price === undefined) {
      throw createHttpError(
        500,
        `Price missing for row label: ${showSeat.seat.row.label}`,
      );
    }

    return sum + price;
  }, 0);
  const convenience = Number((ticketPrice * 0.05).toFixed(2));
  const total = Number((ticketPrice + convenience).toFixed(2));
  const expectedAmount = Math.round(total * 100);

  if (paymentOrder.amount !== expectedAmount) {
    throw createHttpError(409, "Payment amount does not match booking amount");
  }

  const selectedSeatLabels = input.seats.map((seat) => seat.seatNumber);

  const booking = await prisma.$transaction(async (tx) => {
    const updatedSeats = await tx.showSeat.updateMany({
      where: {
        showId: input.showId,
        seatId: { in: uniqueSeatIds },
        status: SeatStatus.AVAILABLE,
      },
      data: {
        status: SeatStatus.BOOKED,
      },
    });

    if (updatedSeats.count !== uniqueSeatIds.length) {
      throw createHttpError(409, "One or more seats are already booked");
    }

    return tx.booking.create({
      data: {
        bookingRef: createBookingRef(),
        userId,
        showId: input.showId,
        seats: selectedSeatLabels,
        status: BookingStatus.CONFIRMED,
        paymentOrderId: paymentOrder.id,
        paymentMethod: input.paymentMethod,
        bookingFee: {
          create: {
            ticketPrice,
            convenience,
            total,
          },
        },
      },
      include: bookingInclude,
    });
  });

  try {
    const lockedSeatsKey = `locked-seats:${input.showId}`;

    await Promise.all(
      uniqueSeatIds.map((seatId) =>
        redis.del(`seat-lock:${input.showId}:${seatId}`),
      ),
    );
    await redis.srem(lockedSeatsKey, ...uniqueSeatIds);
  } catch {
    // Booking is already persisted; stale Redis locks will expire naturally.
  }

  return toBookingResponse(booking);
};

export const getMyBookings = async (userId: string) => {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: bookingInclude,
    orderBy: { bookingDateTime: "desc" },
  });

  return bookings.map(toBookingResponse);
};
