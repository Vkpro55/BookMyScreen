import type { ShowWithTheaterAndMovie } from "../modules/show/show.types.js";
import type { GroupedShow } from "../types/groupedshows.types.js";

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
    });
  });

  return Object.values(grouped);
};
