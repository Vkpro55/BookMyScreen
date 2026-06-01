import { movies } from "../utils/constants";
import Card from "./shared/Card";

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
            return <Card movie={movie} index={index} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Recommended;
