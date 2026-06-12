import dayjs from "dayjs";
import { useState } from "react";
import { useLocation } from "../../context/LocationContext";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getShowsByMovieCityAndDate } from "../../api";
import { useNavigate } from "react-router";

function TheaterTimings({ movideId }: { movideId: string }) {
  const { location } = useLocation();
  const navigate = useNavigate();

  const today = dayjs();
  const [selectedData, setSelectedDate] = useState(today);
  const formattedDate = selectedData.format("YYYY-MM-DD");

  const next7days = Array.from({ length: 7 }, (_, i) => today.add(i, "day"));

  const { data } = useQuery({
    queryKey: ["show", movideId, location, formattedDate],
    queryFn: () =>
      getShowsByMovieCityAndDate(movideId, location, formattedDate),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <hr className="my-2 border-gray-200" />
      <div className="flex items-center gap-2 mb-4 py-4 px-2 overflow-x-auto">
        {next7days.map((date, index) => {
          const isSelected = selectedData.isSame(date, "day");
          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col cursor-pointer border border-gray-200 items-center px-3 py-2 rounded-lg min-w-[50px] ${isSelected ? "bg-black text-white font-semibold" : "text-black hover:bg-gray-100"}`}
            >
              <span className="text-sm font-black">{date.format("D")}</span>
              <span className="text-xs">{date.format("ddd")}</span>
              <span className="text-[10px]"> {date.format("MMM")}</span>
            </button>
          );
        })}
      </div>

      {/* Theater */}
      <div className="px-4 mb-10 space-y-8">
        {data?.length === 0 && (
          <div className="text-center text-gray-500">
            No shows available for selected date
          </div>
        )}
        {data?.map((curr, index) => {
          return (
            <>
              <div key={index} className="flex items-start gap-3 mb-2">
                <img
                  src={curr.theater.theaterDetails.logo}
                  alt={curr.theater.theaterDetails.name}
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <p className="text-lg font-semibold">
                    {curr.theater.theaterDetails.name}
                  </p>
                  <p className="text-sm text-gray-500">Allow Cancellation</p>
                </div>
              </div>

              {/* Timings */}
              <div className="flex flex-wrap gap-3 ml-11">
                {curr.theater.shows.map((slot, index) => {
                  const movieId = curr.movie.id;
                  const theaterId = curr.theater.theaterDetails.id;
                  const showId = slot.id;

                  const movieName = curr.movie.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");

                  return (
                    <button
                      onClick={() =>
                        navigate(
                          `/movies/${movieId}/${movieName}/${location}/theater/${theaterId}/show/${showId}/seat-layout`,
                        )
                      }
                      key={index}
                      className="border cursor-pointer hover:bg-gray-100 border-gray-300 rounded-[16px] px-12 py-2 text-sm flex flex-col items-center justify-center min-w-[100px] max-w-[100px] md:min-w-[200px]"
                    >
                      <span className="leading-tight font-semibold">
                        {new Date(slot.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-[10px] text-gray-500 font-black">
                        {slot.audioType.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

export default TheaterTimings;
