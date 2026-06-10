import { z } from "zod";
import type { Prisma, SeatStatus } from "@repo/db/client";

const FormatEnum = z.enum(["TWO_D", "THREE_D", "IMAX", "PVR_PXL"]);
const SeatStatusEnum = z.enum(["AVAILABLE", "BOOKED", "BLOCKED"]);

// Create show — links to existing screen, prices by row label
export const ShowSchema = z.object({
  movieId: z.cuid2("Invalid movie ID"),
  screenId: z.cuid2("Invalid screen ID"),
  format: FormatEnum,
  audioType: z.string().optional(),
  startTime: z.string().transform((val) => new Date(val)),
  priceMap: z
    .record(z.string(), z.number().positive())
    .refine((map) => Object.keys(map).length > 0, {
      message: "At least one row price is required",
    }),
});

export type ShowInput = z.infer<typeof ShowSchema>;

export const ShowParamsSchema = z.object({
  id: z.cuid2("Invalid show ID"),
});

export const ShowListQuerySchema = z.object({
  // movieId: z.cuid2("Invalid movie ID"),
  movieId: z.string().min(1, "Movie ID is required"),
  city: z.string().min(1, "City is required"),
  date: z.string().transform((val) => new Date(val)),
});

export const UpdateSeatStatusSchema = z.object({
  showId: z.cuid2("Invalid show ID"),
  seatId: z.cuid2("Invalid seat ID"),
  status: SeatStatusEnum,
});

// For listing / grouping shows by theater
export type ShowWithTheaterAndMovie = Prisma.ShowGetPayload<{
  include: {
    movie: true;
    screen: {
      include: {
        theater: true;
      };
    };
  };
}>;

// For show detail / booking page
export type ShowWithDetails = Prisma.ShowGetPayload<{
  include: {
    movie: true;
    screen: {
      include: {
        theater: true;
        rows: true; // ← add this
      };
    };
    showSeats: {
      include: {
        seat: {
          include: {
            row: true;
          };
        };
      };
    };
  };
}>;

export interface ShowRowWithSeats {
  label: string;
  price: number;
  seats: {
    id: string;
    number: number;
    status: SeatStatus;
  }[];
}

export interface ShowBookingDetails {
  id: string;
  startTime: Date;
  format: ShowWithDetails["format"];
  audioType: string | null;
  priceMap: Record<string, number>;
  movie: ShowWithDetails["movie"];
  screen: {
    id: string;
    name: string;
    theater: ShowWithDetails["screen"]["theater"];
  };
  rows: ShowRowWithSeats[];
}
