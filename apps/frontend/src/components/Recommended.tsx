import { movies } from "../utils/constants";

function Recommended() {
  return (
    <div className="w-full py-6 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recommended Movies</h2>
          <span className="text-md text-red-500 cursor-pointer hover:underline font-medium">
            See All
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-col-4 xl:grid-cols-5 gap-4">
          {movies.map((movie, index) => {
            return (
              <div key={index} className="rounded cursor-pointer">
                <div>
                  <img
                    src={movie.img}
                    alt={movie.title}
                    className="w-full h-[300px] object-cover rounded rounded-b-none"
                  />
                </div>

                <div className="bg-black text-white flex justify-between items-center text-sm px-2 py-1">
                  <span>⭐ {movie.rating}/10</span>
                  <span>{movie.votes} Votes</span>
                </div>

                <div className="px-2 py-1">
                  <h3 className="text-lg font-semibold">{movie.title}</h3>
                  <p className="text-sm text-gray-600"> {movie.genre}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Recommended;
