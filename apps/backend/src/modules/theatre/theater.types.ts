import { z } from "zod";
import type { Prisma } from "@repo/db/client";

// ── Theater ──────────────────────────────────────────
export const TheaterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  logo: z.string().min(1, "Logo is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
});

export type TheaterInput = z.infer<typeof TheaterSchema>;

export const TheaterParamsSchema = z.object({
  id: z.cuid2("Invalid CUID format"),
});

export const TheaterStateParamsSchema = z.object({
  state: z.string().min(1, "State is required"),
});

export const TheaterCityParamsSchema = z.object({
  city: z.string().min(1, "City is required"),
});

// ── Screen (with rows + seats — created once) ────────
const SeatInputSchema = z.object({
  number: z.number().int().positive(),
});

const RowInputSchema = z.object({
  label: z.string().min(1, "Row label is required"),
  seats: z.array(SeatInputSchema).min(1, "At least one seat per row"),
});

export const ScreenSchema = z.object({
  name: z.string().min(1, "Screen name is required"),
  rows: z.array(RowInputSchema).min(1, "At least one row is required"),
});

export type ScreenInput = z.infer<typeof ScreenSchema>;

export const ScreenParamsSchema = z.object({
  id: z.cuid2("Invalid theater CUID format"),
  screenId: z.cuid2("Invalid screen CUID format"),
});

export type ScreenWithLayout = Prisma.ScreenGetPayload<{
  include: {
    rows: { include: { seats: true } };
  };
}>;

export type TheaterWithScreens = Prisma.TheaterGetPayload<{
  include: {
    screens: {
      include: {
        rows: { include: { seats: true } };
      };
    };
  };
}>;
