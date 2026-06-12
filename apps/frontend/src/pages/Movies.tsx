import { keepPreviousData, useQuery } from "@tanstack/react-query";
import MovieFilter from "../components/movies/MovieFilter";
import MovieList from "../components/movies/MovieList";
import BannerSlider from "../components/shared/BannerSlider";
import { getAllMovies } from "../api";

function Movies() {
  const { data } = useQuery({
    queryKey: ["allMovies"],
    queryFn: async () => await getAllMovies(),
    ...keepPreviousData,
  });

  return (
    <div>
      <BannerSlider />
      <div className="flex flex-col md:flex-row bg-[#f5f5f5] md:px-[100px] min-h-screen pb-10 pt-8 gap-7">
        <MovieFilter />
        <MovieList allMovies={data ?? []} />
      </div>
    </div>
  );
}

export default Movies;
