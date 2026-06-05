import type { MovieInput } from "../modules/movie/movie.types.js";

import type { TheaterInput } from "../modules/theatre/theater.types.js";

export interface GroupedShow {
  movie: string | MovieInput;
  theater: {
    theaterDetails: string | TheaterInput;
    shows: {
      id: string;
      date: string;
      startTime: string;
      format: string;
      audioType: string;
    }[];
  };
}
