import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Icon } from "@repo/ui/icon";
import { MdChair } from "react-icons/md";
import { getMyBookings } from "../../api";
import type { Booking } from "../../api/types";

function BookingHistory() {
  const {
    data: bookings,
    isLoading,
    isError,
  } = useQuery<Booking[]>({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });

  if (isLoading) {
    return (
      <div className="px-6 rounded-md">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
        <div className="bg-white rounded-md p-5 text-sm text-gray-500">
          Loading your bookings...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-6 rounded-md">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
        <div className="bg-white rounded-md p-5 text-sm text-red-500">
          Unable to load bookings right now.
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="px-6 rounded-md">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
        <div className="bg-white rounded-md p-5 text-sm text-gray-500">
          No bookings yet.
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 rounded-md">
      <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
      {bookings.map((booking) => {
        const ticketPrice = booking.fee?.ticketPrice ?? 0;
        const convenience = booking.fee?.convenience ?? 0;
        const total = booking.fee?.total ?? booking.payment.amount / 100;

        return (
          <div key={booking.id}>
            <div className="bg-white rounded-md mb-4 p-5">
              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                <img
                  src={booking.show.movie.posterUrl}
                  alt={booking.show.movie.title}
                  className="w-30 h-40 object-cover rounded"
                />
                <div className="hidden md:block border-l border-gray-300 h-40 border-dashed" />
                <div className="flex items-start justify-center w-full">
                  <div className="flex-1">
                    <p className="font-normal text-lg">
                      {booking.show.movie.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.show.format}
                      {booking.show.audioType
                        ? ` | ${booking.show.audioType}`
                        : ""}
                    </p>
                    <p className="text-sm font-semibold text-gray-700 mt-2">
                      {dayjs(booking.show.startTime).format(
                        "ddd, D MMM YYYY | h:mm A",
                      )}{" "}
                      - {booking.show.screen.theater.name}
                    </p>
                    <small className="text-gray-700 mt-1">
                      Quantity: {booking.seats.length}
                    </small>
                    <p className="text-md font-semibold text-gray-700 mt-2">
                      <Icon
                        size={24}
                        className="inline items-center mr-2"
                        Icon={MdChair}
                      />
                      {booking.seats.join(", ")}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-700">M-Ticket</p>
                </div>
              </div>
              <div className="p-4 text-right">
                <p className="text-sm text-gray-500">
                  Ticket: Rs.{ticketPrice} + Convenience Fees: Rs.
                  {convenience}
                </p>
                <p className="text-xl font-bold">Rs.{total}</p>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-8">
              <div>
                <p className="font-semibold">Booking Date & Time</p>
                <p>
                  {dayjs(booking.bookingDateTime).format("D MMM YYYY, h:mm A")}
                </p>
              </div>
              <div>
                <p className="font-semibold">Payment Method</p>
                <p>{booking.paymentMethod}</p>
              </div>
              <div>
                <p className="font-semibold">Booking ID</p>
                <p>{booking.bookingRef}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BookingHistory;
