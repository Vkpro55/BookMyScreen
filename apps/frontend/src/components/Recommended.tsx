import Card from "./shared/Card";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRecommendedMovies } from "../api";
import { useNavigate } from "react-router-dom";

import { useLocation } from "../context/LocationContext";
import type { Movie } from "../api/types";

function Recommended() {
  const navigate = useNavigate();

  const { location } = useLocation();

  const handleNavigate = (movie: Movie) => {
    const slug = movie.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    void navigate(`/movies/${location}/${slug}/${movie.id}/ticket`);
  };

  const { data } = useQuery({
    queryKey: ["recommended-movies"],
    queryFn: () => getRecommendedMovies(10),
    placeholderData: [],
    ...keepPreviousData,
  });

  return (
    <div className="w-full py-6 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recommended Movies</h2>
          <span
            className="text-md text-red-500 cursor-pointer hover:underline font-medium"
            onClick={() => navigate("/movies")}
          >
            See All
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-col-4 xl:grid-cols-5 gap-4">
          {data?.map((movie, index) => {
            return (
              <Card
                key={index}
                movie={movie}
                index={index}
                handleNavigate={handleNavigate}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Recommended;
