import { z } from "zod";

const FormatEnum = z.enum(["TWO_D", "THREE_D", "IMAX", "PVR_PXL"]);

export const MovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z
    .number()
    .int()
    .positive("Duration must be a positive number in minutes"),
  genre: z.array(z.string()).nonempty("At least one genre is required"),
  releaseDate: z.string().transform((val) => new Date(val)),
  languages: z.array(z.string()).nonempty("At least one language is required"),
  certification: z.string().min(1, "Certification is required"),
  posterUrl: z.url("Poster must be a valid URL"),
  rating: z.number().min(0).max(10),
  votes: z.number().int().nonnegative(),
  format: FormatEnum.optional(),
});

export type MovieInput = z.infer<typeof MovieSchema>;

export const MovieParamsSchema = z.object({
  id: z.cuid2("Invalid CUID format"),
});

export const MovieRecommendedQuerySchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
});

// For movie details page — shows by city + date
export const MovieShowsQuerySchema = z.object({
  city: z.string().min(1, "City is required"),
  date: z.string().transform((val) => new Date(val)),
});
