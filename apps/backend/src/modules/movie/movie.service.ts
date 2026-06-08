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
