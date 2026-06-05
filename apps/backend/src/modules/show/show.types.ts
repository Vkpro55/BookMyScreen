import { z } from "zod";
import type { Prisma } from "@repo/db/client";

const SeatSchema = z.object({
  number: z.number().int().positive(),
  status: z.enum(["AVAILABLE", "BOOKED", "BLOCKED"]),
});

const RowSchema = z.object({
  row: z.string().min(1),
  seats: z.array(SeatSchema).min(1),
});

export const ShowSchema = z.object({
  movieId: z.string().min(1),
  theaterId: z.string().min(1),
  location: z.string().min(1),
  format: z.enum(["TWO_D", "THREE_D", "IMAX", "PVR_PXL"]),
  audioType: z.string().optional(),
  startTime: z.string().transform((val) => new Date(val)),
  date: z.string().transform((val) => new Date(val)),
  priceMap: z.record(z.string(), z.number()),
  rows: z.array(RowSchema).min(1),
});

export type ShowInput = z.infer<typeof ShowSchema>;

export type ShowWithTheaterAndMovie = Prisma.ShowGetPayload<{
  include: {
    movie: true;
    theater: true;
  };
}>;

export const ShowParamsSchem = z.object({
  movieId: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
  id: z.string().min(1),
});

export const ShowQuerySchema = z.object({
  showId: z.string().min(1),
  rowId: z.string().min(1),
  seatNumber: z.number(),
  status: z.enum(["AVAILABLE", "BOOKED", "BLOCKED"]),
});
