export { isValidEmail } from "./validation.js";

import type { ShowWithTheaterAndMovie } from "../modules/show/show.types.js";
import type { GroupedShow } from "../types/groupedshows.types.js";

const getMinPrice = (priceMap: unknown): number => {
  if (!priceMap || typeof priceMap !== "object" || Array.isArray(priceMap)) {
    return 0;
  }

  const prices = Object.values(priceMap as Record<string, unknown>).filter(
    (value): value is number => typeof value === "number",
  );

  return prices.length > 0 ? Math.min(...prices) : 0;
};

export const groupShowsByTheaterAndMovie = (
  shows: ShowWithTheaterAndMovie[],
): GroupedShow[] => {
  const grouped: Record<string, GroupedShow> = {};

  shows.forEach((show) => {
    const theater = show.screen.theater;
    const key = `${show.movieId}_${theater.id}`;

    grouped[key] ??= {
      movie: show.movie,
      theater: { theaterDetails: theater, shows: [] },
    };

    grouped[key].theater.shows.push({
      id: show.id,
      startTime: show.startTime.toISOString(),
      format: show.format,
      audioType: show.audioType ?? "",
      screenName: show.screen.name,
      minPrice: getMinPrice(show.priceMap),
    });
  });

  return Object.values(grouped);
};
