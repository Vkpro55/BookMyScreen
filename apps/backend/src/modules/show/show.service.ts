import { SeatStatus } from "@repo/db/client";
import prisma from "@repo/db/client";
import type {
  ShowInput,
  ShowWithDetails,
  ShowBookingDetails,
} from "./show.types.js";
import { groupShowsByTheaterAndMovie } from "../../utils/index.js";
import type { GroupedShow } from "../../types/groupedshows.types.js";

const showDetailsInclude = {
  movie: true,
  screen: {
    include: {
      theater: true,
      rows: {
        orderBy: { label: "asc" },
      },
    },
  },
  showSeats: {
    include: {
      seat: {
        include: { row: true },
      },
    },
  },
} as const;

const toShowBookingDetails = (show: ShowWithDetails): ShowBookingDetails => {
  const priceMap = show.priceMap as Record<string, number>;
  const rows = show.screen.rows.map((row) => {
    const price = priceMap[row.label];
  
    if (price === undefined) {
      throw new Error(`Price missing for row label: ${row.label}`);
    }
  
    return {
      label: row.label,
      price,  // now TypeScript knows this is number
      seats: show.showSeats
        .filter((ss) => ss.seat.rowId === row.id)
        .map((ss) => ({
          id: ss.seat.id,
          number: ss.seat.number,
          status: ss.status,
        }))
        .sort((a, b) => a.number - b.number),
    };
  });
  return {
    id: show.id,
    startTime: show.startTime,
    format: show.format,
    audioType: show.audioType,
    priceMap,
    movie: show.movie,
    screen: {
      id: show.screen.id,
      name: show.screen.name,
      theater: show.screen.theater,
    },
    rows,
  };
};

export const createShow = async (
  show: ShowInput,
): Promise<ShowWithDetails | null> => {
  const [movie, screen] = await Promise.all([
    prisma.movie.findUnique({ where: { id: show.movieId } }),
    prisma.screen.findUnique({
      where: { id: show.screenId },
      include: {
        rows: {
          include: { seats: true },
          orderBy: { label: "asc" },
        },
      },
    }),
  ]);

  if (!movie || !screen) return null;

  // Ensure every row on the screen has a price
  for (const row of screen.rows) {
    if (show.priceMap[row.label] === undefined) {
      throw new Error(`Price missing for row label: ${row.label}`);
    }
  }

  return prisma.$transaction(async (tx) => {
    const createdShow = await tx.show.create({
      data: {
        movieId: show.movieId,
        screenId: show.screenId,
        startTime: show.startTime,
        format: show.format,
        audioType: show.audioType,
        priceMap: show.priceMap,
      },
    });

    const showSeatsData = screen.rows.flatMap((row) => {
      const price = show.priceMap[row.label];

      if (price === undefined) {
        throw new Error(`Price missing for row label: ${row.label}`);
      }

      return row.seats.map((seat) => ({
        showId: createdShow.id,
        seatId: seat.id,
        status: SeatStatus.AVAILABLE,
      }));
    });

    await tx.showSeat.createMany({ data: showSeatsData });

    const result = await tx.show.findUnique({
      where: { id: createdShow.id },
      include: showDetailsInclude,
    });

    if (!result) {
      throw new Error("Failed to fetch created show");
    }

    return result;
  });
};

export const getShowsByMovieCityAndDate = async (
  movieId: string,
  city: string,
  date: Date,
): Promise<GroupedShow[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const shows = await prisma.show.findMany({
    where: {
      movieId,
      startTime: { gte: startOfDay, lte: endOfDay },
      screen: {
        theater: { city: { equals: city, mode: "insensitive" } },
      },
    },
    include: {
      movie: true,
      screen: {
        include: { theater: true },
      },
    },
    orderBy: { startTime: "asc" },
  });

  return groupShowsByTheaterAndMovie(shows);
};

export const getShowById = async (
  id: string,
): Promise<ShowBookingDetails | null> => {
  const show = await prisma.show.findUnique({
    where: { id },
    include: showDetailsInclude,
  });
  if (!show) return null;
  return toShowBookingDetails(show);
};

export const updateSeatStatus = async (
  showId: string,
  seatId: string,
  status: SeatStatus,
) => {
  const showSeat = await prisma.showSeat.findUnique({
    where: {
      showId_seatId: { showId, seatId },
    },
  });

  if (!showSeat) return null;

  return prisma.showSeat.update({
    where: {
      showId_seatId: { showId, seatId },
    },
    data: { status },
    include: {
      seat: {
        include: { row: true },
      },
    },
  });
};
