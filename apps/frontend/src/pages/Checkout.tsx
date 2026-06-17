import dayjs from "dayjs";
import Header from "../components/seatlayout/Header";
import { calculateTotalPrice, groupSeatsByType } from "../utils";
import { FaInfoCircle } from "react-icons/fa";
import { CiCircleQuestion, CiUser } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import { useSeatContext } from "../context/SeatContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location } = useLocation();
  const {
    selectedSeats,
    shows,
    checkoutExpiresAt,
    setSelectedSeats,
    setShows,
    setCheckoutExpiresAt,
  } = useSeatContext();
  const { base, tax, total } = calculateTotalPrice(selectedSeats);
  const { socket } = useSocket();

  const getInitialTimeLeft = () => {
    if (!checkoutExpiresAt) {
      return 300;
    }

    const expiresAt = new Date(checkoutExpiresAt).getTime();
    const diffSeconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    return diffSeconds > 0 ? diffSeconds : 0;
  };

  const [timeLeft, setTimeLeft] = useState<number>(getInitialTimeLeft);

  useEffect(() => {
    if (!shows || selectedSeats.length === 0) {
      void navigate("/");
      return;
    }

    const expire = () => {
      if (socket) {
        socket.send(
          JSON.stringify({
            type: "unlock-seats",
            showId: shows.id,
            seatIds: selectedSeats.map((seat) => seat.seatId),
            userId: user?.id,
          }),
        );
      }

      setSelectedSeats([]);
      setShows(null);
      setCheckoutExpiresAt(null);
      toast.error("Time expired!");
      void navigate("/");
    };

    if (timeLeft <= 0) {
      expire();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev): number => {
        if (prev <= 1) {
          expire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    checkoutExpiresAt,
    navigate,
    selectedSeats,
    shows,
    socket,
    user,
    setSelectedSeats,
    setShows,
    setCheckoutExpiresAt,
  ]);

  return (
    <div className="min-h-screen w-full bg-white">
      <Header type="checkout" />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-red-500 text-center mb-3 text-lg border rounded-[14px] border-dashed py-2 font-semibold">
          Time left: {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Part */}
          <div className="flex-1 space-y-4">
            {/* Movie Details */}
            <div className="flex gap-4">
              <img
                src={shows?.movie.posterUrl}
                alt={shows?.movie.title}
                className="w-[60px] h-[90px] rounded object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{shows?.movie.title}</h3>
                <p className="text-sm text-gray-600">
                  {shows?.movie.certification} •{" "}
                  {shows?.movie.languages.join(", ")} • {shows?.movie.format}
                </p>
                <p className="text-sm text-gray-600">
                  {shows?.screen.theater.name}, {shows?.screen.theater.city},{" "}
                  {shows?.screen.theater.state}
                </p>
              </div>
            </div>
            {/* Show Details */}
            <div className="border border-gray-200 rounded-[24px] px-6 py-5">
              <p className="text-md font-medium border-b pb-5 border-gray-200">
                {dayjs(shows?.startTime, "DD-MM-YYYY")
                  .format("D MMMM YYYY")
                  .split(" ")
                  .slice(0, 2)
                  .join(" ")}{" "}
                &nbsp;•{" "}
                <span className="font-semibold">{shows?.startTime}</span>
              </p>
              <div className="flex items-center justify-between mt-4 mb-4">
                <div>
                  <p className="text-md mt-2 font-semibold">
                    {selectedSeats.length} ticket
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">
                      {groupSeatsByType(selectedSeats).map(
                        ({ type, seats }) => (
                          <div key={type} className="font-medium">
                            <p className="inline mr-2 text-gray-800">
                              {type} -{" "}
                            </p>
                            <ul className="inline-flex gap-1">
                              {seats.map((seat) => (
                                <li key={seat.seatNumber}>{seat.seatNumber}</li>
                              ))}
                            </ul>
                          </div>
                        ),
                      )}
                    </span>
                  </div>
                </div>
                <p className="text-md font-semibold mt-2">
                  <span className="text-gray-700">₹</span>
                  {base}
                </p>
              </div>
            </div>

            {/* Cancellation Notice */}
            <div className="bg-white border rounde-[24px] border-gray-200 text-yellow-800 text-sm px-6 py-5 tracking-wide">
              <span className="font-medium flex items-center gap-2">
                <FaInfoCircle size={24} /> No cancellation or refund available
                after payment.
              </span>
            </div>
          </div>

          {/* Right Part */}
          {/* Right Section */}
          <div className="w-full lg:w-[300px] space-y-4">
            <h4 className="font-medium text-gray-900 text-lg">
              Payment Summary
            </h4>
            <div className="border border-gray-200 rounded-[24px] px-6 py-7 space-y-2">
              <div className="flex justify-between text-md">
                <span className="text-sm text-gray-500">Order amount</span>
                <span>₹{base}</span>
              </div>
              <div className="flex justify-between text-md pb-4">
                <span className="font-semibold text-sm">Taxes & fees (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-md font-semibold border-t border-gray-200 pt-4">
                <span>To be paid</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* User details */}
            <h4 className="text-lg font-medium">Your details</h4>
            <div className="border flex items-start gap-3 border-gray-200 rounded-[24px] px-6 py-7">
              <CiUser size={24} />
              <div className="-mt-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-sm text-gray-600">+91-{user?.phone}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-600">{location}</p>
              </div>
            </div>

            {/* Terms and button */}
            <div className="border border-gray-200 rounded-[24px] px-6 py-5">
              <p className="text-sm font-medium cursor-pointer flex items-center gap-2">
                <CiCircleQuestion size={24} /> Terms and conditions
              </p>
            </div>

            <div className="flex justify-between items-center bg-black rounded-[24px] px-6 py-4 cursor-pointer">
              <p className="text-white font-bold">
                ₹{total} <span className="text-xs font-medium">TOTAL</span>
              </p>
              <p className="text-white font-medium">Proceed To Pay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
