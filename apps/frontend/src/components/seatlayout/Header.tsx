import { useNavigate } from "react-router";
import mainLogo from "../../assets/main-icon.png";
import type { ShowBookingDetails } from "../../api/types";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import { FaUser } from "react-icons/fa";

function Header({
  showData,
  type,
}: {
  showData?: ShowBookingDetails;
  type?: "checkout";
}) {
  const navigate = useNavigate();
  const { auth, user, toggleModal } = useAuth();

  return (
    <>
      <div className="border-b border-gray-200 bg-white">
        {/* Top Navbar */}
        <div className="flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <img
            onClick={() => navigate("/")}
            src={mainLogo}
            alt="bookMyScreen"
            className="h-6 md:h-8 object-contain cursor-pointer"
          />

          {type === "checkout" ? (
            <div>
              <h2 className="font-bold text-gray-900 text-lg md:text-xl">
                Review your booking
              </h2>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="font-bold text-lg md:text-xl">
                {showData?.movie.title}
              </h2>
              <p className="text-xs text-gray-500 font-semibold">
                {dayjs(showData?.startTime).format("D MMMM YYYY")} at{" "}
                {dayjs(showData?.startTime).format("h:mm A")}
                {showData?.screen.theater.name +
                  ", " +
                  showData?.screen.theater.city +
                  ", " +
                  showData?.screen.theater.state}
              </p>
            </div>
          )}

          {auth ? (
            <>
              <div className="flex items-center gap-6">
                <span className="cursor-pointer text-sm font-medium border rounded-full border-gray-300 p-2">
                  <FaUser className="text-gray-500" />
                </span>
                <span
                  onClick={() => navigate(`/profile/${user?.id}`)}
                  className="text-sm -ml-3 font-normal cursor-pointer hover:text-red-500"
                >
                  Hi, {user ? user.name : "Test User"} &nbsp; ▼
                </span>
              </div>
            </>
          ) : (
            <button
              onClick={() => toggleModal()}
              className="bg-[#f84464] cursor-pointer
                                    text-white px-4 py-1.5 rounded text-sm"
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* show timing */}

      {type !== "checkout" && (
        <div className="bg-white pt-4">
          <div className="mx-auto px-6 pb-4 flex items-center gap-4 max-w-7xl">
            <div className="text-sm text-gray-700">
              <p className="text-xs text-gray-500 font-medium">
                {dayjs(showData?.startTime, "DD-MM-YYYY").format("ddd")}
              </p>
              <p className="text-sm font-semibold text-gray-700">
                {dayjs(showData?.startTime, "DD-MM-YYYY").format("DD MMMM")}
              </p>
            </div>

            <button
              className={`border cursor-pointer rounded-[14px] px-8 py-3 text-sm border-black font-medium bg-gray-200
            `}
            >
              {dayjs(showData?.startTime).format("hh:mm A")}
              <p className="text-[10px] text-gray-500 -mt-1">
                {showData?.audioType?.toUpperCase()}
              </p>
            </button>
          </div>
        </div>
      )}

      {type !== "checkout" && (
        <hr className="my-2 border-gray-300 max-w-7xl mx-auto" />
      )}
    </>
  );
}

export default Header;
