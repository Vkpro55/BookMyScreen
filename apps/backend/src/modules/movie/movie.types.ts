import type { Movie } from "@repo/db/client";
import { z } from "zod";

export type CreateMovieDto = Omit<Movie, "id" | "createdAt" | "updatedAt">;

export const MovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  genre: z.array(z.string()).nonempty("At least one genre is required"),
  releaseDate: z.date(), // or z.string().transform(val => new Date(val)) if input is string
  languages: z.array(z.string()).nonempty("At least one language is required"),
  certification: z.string().min(1, "Certification is required"),
  posterUrl: z.url("Poster must be a valid URL"),
  rating: z.number().min(0).max(10),
  votes: z.number().int().nonnegative(),
  format: z.array(z.string()).optional(),
});

// Type inference from schema
export type MovieInput = z.infer<typeof MovieSchema>;

export const MovieParamsSchema = z.object({
  id: z.cuid2("Invalid CUID format"),
  limit: z.number("Invalid limit type"),
});
