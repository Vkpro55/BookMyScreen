import { SeatStatus } from "@repo/db/client";
import prisma from "@repo/db/client";
import type { ShowInput, ShowWithDetails } from "./show.types.js";
import { groupShowsByTheaterAndMovie } from "../../utils/index.js";
import type { GroupedShow } from "../../types/groupedshows.types.js";

const showDetailsInclude = {
  movie: true,
  screen: {
    include: { theater: true },
  },
  showSeats: {
    include: {
      seat: {
        include: { row: true },
      },
    },
  },
} as const;

export const createShow = async (
  show: ShowInput,
): Promise<ShowWithDetails | null> => {
  const [movie, screen] = await Promise.all([
    prisma.movie.findUnique({ where: { id: show.movieId } }),
    prisma.screen.findUnique({
      where: { id: show.screenId },
      include: {
        rows: {
          include: { seats: true },
          orderBy: { label: "asc" },
        },
      },
    }),
  ]);

  if (!movie || !screen) return null;

  // Ensure every row on the screen has a price
  for (const row of screen.rows) {
    if (show.priceMap[row.label] === undefined) {
      throw new Error(`Price missing for row label: ${row.label}`);
    }
  }

  return prisma.$transaction(async (tx) => {
    const createdShow = await tx.show.create({
      data: {
        movieId: show.movieId,
        screenId: show.screenId,
        startTime: show.startTime,
        format: show.format,
        audioType: show.audioType,
      },
    });

    const showSeatsData = screen.rows.flatMap((row) => {
      const price = show.priceMap[row.label];

      if (price === undefined) {
        throw new Error(`Price missing for row label: ${row.label}`);
      }

      return row.seats.map((seat) => ({
        showId: createdShow.id,
        seatId: seat.id,
        price,
        status: SeatStatus.AVAILABLE,
      }));
    });

    await tx.showSeat.createMany({ data: showSeatsData });

    const result = await tx.show.findUnique({
      where: { id: createdShow.id },
      include: showDetailsInclude,
    });

    if (!result) {
      throw new Error("Failed to fetch created show");
    }

    return result;
  });
};

export const getShowsByMovieCityAndDate = async (
  movieId: string,
  city: string,
  date: Date,
): Promise<GroupedShow[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const shows = await prisma.show.findMany({
    where: {
      movieId,
      startTime: { gte: startOfDay, lte: endOfDay },
      screen: {
        theater: { city: { equals: city, mode: "insensitive" } },
      },
    },
    include: {
      movie: true,
      screen: {
        include: { theater: true },
      },
    },
    orderBy: { startTime: "asc" },
  });

  return groupShowsByTheaterAndMovie(shows);
};

export const getShowById = async (
  id: string,
): Promise<ShowWithDetails | null> => {
  return prisma.show.findUnique({
    where: { id },
    include: showDetailsInclude,
  });
};

export const updateSeatStatus = async (
  showId: string,
  seatId: string,
  status: SeatStatus,
) => {
  const showSeat = await prisma.showSeat.findUnique({
    where: {
      showId_seatId: { showId, seatId },
    },
  });

  if (!showSeat) return null;

  return prisma.showSeat.update({
    where: {
      showId_seatId: { showId, seatId },
    },
    data: { status },
    include: {
      seat: {
        include: { row: true },
      },
    },
  });
};
