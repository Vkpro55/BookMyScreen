import prisma from "@repo/db/client";
import type { Movie } from "@repo/db/client";
import type { MovieInput } from "./movie.types.js";

export const createMovie = async (movie: MovieInput): Promise<Movie> => {
  return await prisma.movie.create({ data: movie });
};

export const getAllMovies = async (): Promise<Movie[]> => {
  return await prisma.movie.findMany({
    orderBy: {
      releaseDate: "asc",
    },
  });
};

export const getMovieById = async (id: string): Promise<Movie | null> => {
  return await prisma.movie.findUnique({ where: { id } });
};

export const getTopMoviesByVotes = async (limit: number): Promise<Movie[]> => {
  return await prisma.movie.findMany({
    orderBy: {
      votes: "asc",
    },
    take: limit,
  });
};
