import type { Format, Movie, Theater } from "@repo/db/client";

export interface GroupedShow {
  movie: Movie;
  theater: {
    theaterDetails: Theater;
    shows: {
      id: string;
      startTime: string;
      format: Format;
      audioType: string;
      screenName: string;
    }[];
  };
}
