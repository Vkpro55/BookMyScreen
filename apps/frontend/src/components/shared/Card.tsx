// interface Movie {
//     id: string;
//     title: string;
//     genre: string[];
//     rating: number;
//     votes: number;
//     posterUrl: string;
//     promoted?: boolean;
// }

import type { Movie } from "../../api/types";

interface ICardProps {
  movie: Movie;
  index: number;
  handleNavigate: (movie: Movie) => void;
}

function Card({ movie, index, handleNavigate }: ICardProps) {
  return (
    <div
      key={index}
      className="rounded cursor-pointer"
      onClick={() => handleNavigate(movie)}
    >
      <div>
        <img
          src={movie.posterUrl}
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
}

export default Card;
