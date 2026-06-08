import prisma from "@repo/db/client";
import type { Theater } from "@repo/db/client";
import type {
  TheaterInput,
  ScreenInput,
  ScreenWithLayout,
  TheaterWithScreens,
} from "./theater.types.js";

// ── Theater CRUD ─────────────────────────────────────
export const createTheater = async (
  theatre: TheaterInput,
): Promise<Theater> => {
  return prisma.theater.create({ data: theatre });
};

export const getAllTheaters = async (): Promise<Theater[]> => {
  return prisma.theater.findMany({ orderBy: { name: "asc" } });
};

export const getTheaterById = async (
  id: string,
): Promise<TheaterWithScreens | null> => {
  return prisma.theater.findUnique({
    where: { id },
    include: {
      screens: {
        include: {
          rows: {
            include: { seats: true },
            orderBy: { label: "asc" },
          },
        },
        orderBy: { name: "asc" },
      },
    },
  });
};

// FIX: was querying `name`, should be `state`
export const getTheaterByState = async (state: string): Promise<Theater[]> => {
  return prisma.theater.findMany({
    where: {
      state: { equals: state, mode: "insensitive" },
    },
    orderBy: { name: "asc" },
  });
};

export const getTheaterByCity = async (city: string): Promise<Theater[]> => {
  return prisma.theater.findMany({
    where: {
      city: { equals: city, mode: "insensitive" },
    },
    orderBy: { name: "asc" },
  });
};

// ── Screen management ────────────────────────────────
export const createScreen = async (
  theaterId: string,
  screen: ScreenInput,
): Promise<ScreenWithLayout> => {
  return prisma.screen.create({
    data: {
      name: screen.name,
      theaterId,
      rows: {
        create: screen.rows.map((row) => ({
          label: row.label,
          seats: {
            create: row.seats.map((seat) => ({
              number: seat.number,
            })),
          },
        })),
      },
    },
    include: {
      rows: {
        include: { seats: true },
        orderBy: { label: "asc" },
      },
    },
  });
};

export const getScreensByTheater = async (
  theaterId: string,
): Promise<ScreenWithLayout[]> => {
  return prisma.screen.findMany({
    where: { theaterId },
    include: {
      rows: {
        include: { seats: true },
        orderBy: { label: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });
};

export const getScreenById = async (
  theaterId: string,
  screenId: string,
): Promise<ScreenWithLayout | null> => {
  return prisma.screen.findFirst({
    where: { id: screenId, theaterId },
    include: {
      rows: {
        include: { seats: true },
        orderBy: { label: "asc" },
      },
    },
  });
};
