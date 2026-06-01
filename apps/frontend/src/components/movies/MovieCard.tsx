interface Movie {
    id: number;
    title: string;
    genre: string;
    rating?: number;
    votes?: string;
    img: string;
    promoted?: boolean;
    languages: string;
    age?: string;
}

interface IMovieCardProps {
    movie: Movie;
}

function MovieCard({ movie }: IMovieCardProps) {
    return (
        <div className="w-40 md:w-52 cursor-pointer">
            <img src={movie.img} alt={movie.title} className="rounded-lg shadow-md" />
            <p className="font-medium mt-2">{movie.title}</p>
            <p className="text-xs text-gray-500">{movie.rating} | {movie.votes}</p>
            <p className="text-sm text-gray-500">{movie.age}</p>
            <p className="text-sm text-gray-500 truncate">{(movie.languages.split(",").join(" | "))}</p>
        </div>
    )
}

export default MovieCard
