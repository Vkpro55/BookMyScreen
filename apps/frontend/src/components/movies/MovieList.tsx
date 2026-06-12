import { languages } from "../../utils/constants";
import type { Movie } from "../../api/types";
import MovieCard from "./MovieCard";

function MovieList({ allMovies }: { allMovies: Movie[] }) {
  return (
    <div className="w-full md:w-3/4 p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {languages.map((lang, index) => {
          return (
            <span
              key={index}
              className=" border border-gray-200 rounded-full bg-white px-3 py-1 text-red-500 text-sm cursor-pointer hover:bg-gray-100"
            >
              {lang}
            </span>
          );
        })}
      </div>

      <div className="bg-white flex justify-between items-center px-6 py-6 rounded mb-6">
        <h3 className="text-xl font-semibold">Comming Soon</h3>
        <button className="text-sm text-red-500">
          Explore Upcoming Movies <span className="ml-1">→</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-6">
        {allMovies.length === 0 && (
          <p className="text-gray-500">No movies available.</p>
        )}
        {allMovies.map((movie, index) => {
          return <MovieCard key={index} movie={movie} />;
        })}
      </div>
    </div>
  );
}

export default MovieList;
