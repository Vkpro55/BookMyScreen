// Matches backend apps/backend/src/types/response.types.ts
export interface ApiError {
  field?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: ApiError | ApiError[];
}

// ── Enums (mirror Prisma) ──
export type Format = "TWO_D" | "THREE_D" | "IMAX" | "PVR_PXL";
export type SeatStatus = "AVAILABLE" | "BOOKED" | "BLOCKED";

// ── Movie ──
export interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  genre: string[];
  releaseDate: string;
  languages: string[];
  certification: string;
  posterUrl: string;
  rating: number;
  votes: number;
  format: Format | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieInput {
  title: string;
  description: string;
  duration: number;
  genre: string[];
  releaseDate: string;
  languages: string[];
  certification: string;
  posterUrl: string;
  rating: number;
  votes: number;
  format?: Format;
}

// ── Theater ──
export interface Theater {
  id: string;
  name: string;
  city: string;
  state: string;
  location: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTheaterInput {
  name: string;
  location: string;
  logo: string;
  city: string;
  state: string;
}

export interface Seat {
  id: string;
  number: number;
  rowId: string;
}

export interface Row {
  id: string;
  label: string;
  screenId: string;
  seats: Seat[];
}

export interface Screen {
  id: string;
  name: string;
  theaterId: string;
  rows: Row[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateScreenInput {
  name: string;
  rows: {
    label: string;
    seats: { number: number }[];
  }[];
}

// ── Show ──
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
      minPrice: number;
    }[];
  };
}

export interface ShowRowWithSeats {
  label: string;
  price: number;
  seats: {
    id: string;
    number: number;
    status: SeatStatus;
  }[];
}

export interface ShowBookingDetails {
  id: string;
  startTime: string;
  format: Format;
  audioType: string | null;
  priceMap: Record<string, number>;
  movie: Movie;
  screen: {
    id: string;
    name: string;
    theater: Theater;
  };
  rows: ShowRowWithSeats[];
}

export interface CreateShowInput {
  movieId: string;
  screenId: string;
  format: Format;
  audioType?: string;
  startTime: string;
  priceMap: Record<string, number>;
}

export interface UpdateSeatStatusInput {
  showId: string;
  seatId: string;
  status: SeatStatus;
}
