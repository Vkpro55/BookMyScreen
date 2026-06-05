import prisma from "@repo/db/client";
import type { Movie } from "@repo/db/client";
import type { MovieInput } from "./movie.types.js";

export const createMovie = async (movie: MovieInput): Promise<Movie> => {
  return prisma.movie.create({ data: movie });
};

export const getAllMovies = async (): Promise<Movie[]> => {
  return prisma.movie.findMany({ orderBy: { releaseDate: "asc" } });
};

export const getMovieById = async (id: string): Promise<Movie | null> => {
  return prisma.movie.findUnique({ where: { id } });
};

export const getTopMoviesByVotes = async (limit: number): Promise<Movie[]> => {
  return prisma.movie.findMany({
    orderBy: { votes: "desc" },
    take: limit,
  });
};

// New — powers MovieDetails / TheaterTimings
export const getMovieShowsByCityAndDate = async (
  movieId: string,
  city: string,
  date: Date,
) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.show.findMany({
    where: {
      movieId,
      startTime: { gte: startOfDay, lte: endOfDay },
      screen: {
        theater: { city: { equals: city, mode: "insensitive" } },
      },
    },
    include: {
      movie: true,
      screen: {
        include: { theater: true },
      },
    },
    orderBy: { startTime: "asc" },
  });
};
