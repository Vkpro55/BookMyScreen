import type { SeatStatus, Show } from "@repo/db/client";
import type { ShowInput, ShowWithTheaterAndMovie } from "./show.types.js";
import prisma from "@repo/db/client";
import { groupShowsByTheaterAndMovie } from "../../utils/index.js";
import type { GroupedShow } from "../../types/groupedshows.types.js";

export const createShow = async (show: ShowInput): Promise<Show> => {
  return await prisma.show.create({
    data: {
      movieId: show.movieId,
      theaterId: show.theaterId,
      location: show.location,
      format: show.format,
      audioType: show.audioType,
      startTime: show.startTime,
      date: show.date,
      priceMap: show.priceMap,

      rows: {
        create: show.rows.map((row) => ({
          row: row.row,

          seats: {
            create: row.seats.map((seat) => ({
              number: seat.number,
              status: seat.status,
            })),
          },
        })),
      },
    },

    include: {
      rows: {
        include: {
          seats: true,
        },
      },
      movie: true,
      theater: true,
    },
  });
};

export const getShowsByMovieDateLocation = async (
  movieId: string,
  location: string,
  date: string,
): Promise<GroupedShow[]> => {
  const shows = await prisma.show.findMany({
    where: {
      movieId,
      location,
      date,
    },
    include: {
      movie: true,
      theater: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  const groupedShows = groupShowsByTheaterAndMovie(shows);

  return groupedShows;
};

export const getShowById = async (
  id: string,
): Promise<ShowWithTheaterAndMovie | null> => {
  return await prisma.show.findUnique({
    where: { id },
    include: {
      movie: true,
      theater: true,
    },
  });
};

export const updateSeatStatus = async (
  showId: string,
  rowId: string,
  seatNumber: number,
  status: SeatStatus,
): Promise<void> => {
  // First ensure the row belongs to the show
  const row = await prisma.row.findFirst({
    where: { id: rowId, showId },
  });

  if (!row) throw new Error("Row not found for this show");

  await prisma.seat.update({
    where: {
      rowId_number: { rowId: row.id, number: seatNumber },
    },
    data: { status },
  });
};
