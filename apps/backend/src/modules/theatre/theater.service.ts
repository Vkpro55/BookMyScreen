import prisma from "@repo/db/client";
import type { Theater } from "@repo/db/client";
import type { TheaterInput } from "./theater.types.js";

export const createTheater = async (
  theatre: TheaterInput,
): Promise<Theater> => {
  return await prisma.theater.create({ data: theatre });
};

export const getAllTheaters = async (): Promise<Theater[]> => {
  return await prisma.theater.findMany();
};

export const getTheaterById = async (id: string): Promise<Theater | null> => {
  return await prisma.theater.findUnique({ where: { id } });
};

export const getTheaterByState = async (state: string): Promise<Theater[]> => {
  return await prisma.theater.findMany({
    where: {
      name: {
        equals: state,
        mode: "insensitive",
      },
    },
  });
};
