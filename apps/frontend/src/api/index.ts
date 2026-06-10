import { axiosWrapper, ApiRequestError } from "./axiosWrapper";
import type {
  ApiResponse,
  Movie,
  CreateMovieInput,
  Theater,
  CreateTheaterInput,
  Screen,
  CreateScreenInput,
  GroupedShow,
  ShowBookingDetails,
  CreateShowInput,
  UpdateSeatStatusInput,
  SeatStatus,
} from "./types";

export { ApiRequestError };

const getData = async <T>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> => {
  const { data } = await promise;

  if (data.data === undefined) {
    throw new ApiRequestError("Response missing data");
  }

  return data.data;
};

// ── Movies ──────────────────────────────────────────

export const getAllMovies = () => getData<Movie[]>(axiosWrapper.get("/movies"));

export const getRecommendedMovies = (limit = 10) =>
  getData<Movie[]>(
    axiosWrapper.get("/movies/recommended", { params: { limit } }),
  );

export const getMovieById = (id: string) =>
  getData<Movie>(axiosWrapper.get(`/movies/${id}`));

export const createMovie = (body: CreateMovieInput) =>
  getData<Movie>(axiosWrapper.post("/movies", body));

// ── Theaters ────────────────────────────────────────

export const getAllTheaters = () =>
  getData<Theater[]>(axiosWrapper.get("/theaters"));

export const getTheaterById = (id: string) =>
  getData<Theater & { screens: Screen[] }>(axiosWrapper.get(`/theaters/${id}`));

export const getTheatersByCity = (city: string) =>
  getData<Theater[]>(axiosWrapper.get(`/theaters/city/${city}`));

export const getTheatersByState = (state: string) =>
  getData<Theater[]>(axiosWrapper.get(`/theaters/state/${state}`));

export const createTheater = (body: CreateTheaterInput) =>
  getData<Theater>(axiosWrapper.post("/theaters", body));

// ── Screens ─────────────────────────────────────────

export const getScreensByTheater = (theaterId: string) =>
  getData<Screen[]>(axiosWrapper.get(`/theaters/${theaterId}/screens`));

export const getScreenById = (theaterId: string, screenId: string) =>
  getData<Screen>(
    axiosWrapper.get(`/theaters/${theaterId}/screens/${screenId}`),
  );

export const createScreen = (theaterId: string, body: CreateScreenInput) =>
  getData<Screen>(axiosWrapper.post(`/theaters/${theaterId}/screens`, body));

// ── Shows ───────────────────────────────────────────

export const getShowsByMovieCityAndDate = (
  movieId: string,
  city: string,
  date: string,
) =>
  getData<GroupedShow[]>(
    axiosWrapper.get("/shows", { params: { movieId, city, date } }),
  );

export const getShowById = (id: string) =>
  getData<ShowBookingDetails>(axiosWrapper.get(`/shows/${id}`));

export const createShow = (body: CreateShowInput) =>
  getData<ShowBookingDetails>(axiosWrapper.post("/shows", body));

export interface UpdatedShowSeat {
  id: string;
  showId: string;
  seatId: string;
  status: SeatStatus;
  seat: {
    id: string;
    number: number;
    row: { id: string; label: string };
  };
}

export const updateSeatStatus = (body: UpdateSeatStatusInput) =>
  getData<UpdatedShowSeat>(axiosWrapper.patch("/shows/seats/status", body));
