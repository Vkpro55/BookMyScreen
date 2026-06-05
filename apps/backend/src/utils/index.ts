import type { ShowWithTheaterAndMovie } from "../modules/show/show.types.js";
import type { GroupedShow } from "../types/groupedshows.types.js";

export const groupShowsByTheaterAndMovie = (
  shows: ShowWithTheaterAndMovie[],
): GroupedShow[] => {
  // unique key : movieId_theaterId
  const grouped: Record<string, GroupedShow> = {};

  shows.forEach((show) => {
    const movieId = show.movieId;
    const theaterId = show.theaterId;
    const key = `${movieId}_${theaterId}`;

    grouped[key] ??= {
      movie: show.movie,
      theater: {
        theaterDetails: show.theater,
        shows: [],
      },
    };

    grouped[key].theater.shows.push({
      id: show.id,
      date: show.date.toISOString(),
      startTime: show.startTime.toISOString(),
      format: show.format,
      audioType: show.audioType ?? "",
    });
  });

  return Object.values(grouped);
};
