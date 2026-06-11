// interface Movie {
//     id: number;
//     title: string;
//     genre: string;
//     rating?: number;
//     votes?: string;
//     img: string;
//     promoted?: boolean;
//     languages: string;
//     age?: string;
// }

import { useNavigate } from "react-router-dom";
import type { Movie } from "../../api/types"
import { useLocation } from "../../context/LocationContext";

// interface IMovieCardProps {
//     movie: Movie;
// }

function MovieCard({ movie }: { movie: Movie }) {

    const navigate = useNavigate();
    const { location } = useLocation();

    const handleNavigate = (movie: Movie) => {
        const slug = movie.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        void navigate(
            `/movies/${location}/${slug}/${movie.id}/ticket`,
        );
    };

    return (
        <div className="w-40 md:w-52 cursor-pointer" onClick={() => handleNavigate(movie)}>
            <img src={movie.posterUrl} alt={movie.title} className="rounded-lg shadow-md" />
            <p className="font-medium mt-2">{movie.title}</p>
            <p className="text-xs text-gray-500">{movie.rating} | {movie.votes}</p>
            <p className="text-sm text-gray-500">{movie.genre}</p>
            <p className="text-sm text-gray-500 truncate">{(movie.languages.join(" | "))}</p>
        </div>
    )
}

export default MovieCard
