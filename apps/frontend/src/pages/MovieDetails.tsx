import { FaShareAlt } from "react-icons/fa";
import { filters } from "../utils/constants";
import TheaterTimings from "../components/movies/TheaterTimings";
import { Icon } from "@repo/ui/icon";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMovieById } from "../api";
import { useParams } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams() as { id: string };

  const { data } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <div
        className="relative text-white px-4 py-10"
        style={{
          backgroundImage: `url(${data?.posterUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay layer */}
        <div className="absolute inset-0 bg-black opacity-70"></div>
        {/* Actual content */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Poster */}
          <div>
            <img
              src={data?.posterUrl}
              alt={data?.title}
              className="rounde-2xl w-52 shadow-md"
            />
          </div>
          {/* Details */}
          <div className="flex flex-col justify-start flex-1 gap-4">
            <h1 className="text-4xl font-bold">{data?.title}</h1>
            <div className="bg-[#3a3a3a] px-4 py-2 rounded-md flex items-center gap-2 text-sm self-start">
              <span className="text-pink-500 font-bold">★ {data?.rating} </span>
              <span className="text-gray-300">
                ({data?.votes} Votes) <span className="ml-1">→</span>{" "}
              </span>
              <button className="cursor-pointer bg-[#2f2f2f] rounded-md px-4 py-2 hover:bg-[#4a4a4a] ml-6">
                Rate Now
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="bg-[#3a3a3a] px-3 py-1 rounded">
                {data?.format?.split(",").join(" | ")}
              </span>
              <span className="bg-[#3a3a3a] px-3 py-1 rounded">
                {data?.languages ? data.languages.join(" | ") : ""}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">About the movie</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {data?.description}
              </p>
            </div>
          </div>

          {/* Share button */}
          <div className="absolute top-0 right-0 cursor-pointer">
            <button className="flex items-center gap-2 cursor-pointer bg-[#3a3a3a] px-4 py-2 rounded text-sm">
              <Icon Icon={FaShareAlt} variant="white" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {filters.map((filter, i) => (
            <button
              className="border border-gray-300 px-5 py-1 rounded-lg
                    cursor-pointer text-sm hover:bg-gray-100"
              key={i}
            >
              {filter}
            </button>
          ))}
        </div>

        <hr className="my-2 border-gray-200" />

        {/* Avalability Status  */}
        <div className="flex items-center gap-4 rounded-s-sm mb-1 py-2 text-sm px-8 bg-gray-200">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 mr-1 bg-black rounded-full inline-block"></span>
            <small className="font-semibold text-gray-500">Available</small>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 mr-1 font-semibold bg-yellow-400 rounded-full inline-block"></span>
            <small className="font-semibold text-gray-500">Filling fast</small>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 mr-1 font-semibold bg-red-400 rounded-full inline-block"></span>
            <small className="font-semibold text-gray-500"> Almost full</small>
          </span>
        </div>

        <TheaterTimings movideId={id} />
      </div>
    </>
  );
}

export default MovieDetails;
