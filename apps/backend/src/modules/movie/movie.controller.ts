import type { Request, Response, NextFunction } from "express";
import * as MovieService from "./movie.service.js";
import * as MovieTypes from "./movie.types.js";
import type { ApiResponse, IError } from "../../types/response.types.js";

export const createMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = MovieTypes.MovieSchema.safeParse(req.body);

    if (!result.success) {
      const errors: IError[] = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const response: ApiResponse<null> = {
        success: false,
        errors,
      };
      res.status(400).json(response);
      return;
    }

    const movie = await MovieService.createMovie(result.data);

    const response: ApiResponse<typeof movie> = {
      success: true,
      data: movie,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllMovies = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const movies = await MovieService.getAllMovies();

    const response: ApiResponse<typeof movies> = {
      success: true,
      data: movies,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = MovieTypes.MovieParamsSchema.safeParse(req.params);

    if (!result.success) {
      const errors: IError[] = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const response: ApiResponse<null> = {
        success: false,
        errors,
      };
      res.status(400).json(response);
      return;
    }

    const { id } = result.data;
    const movie = await MovieService.getMovieById(id);

    if (!movie) {
      const response: ApiResponse<null> = {
        success: false,
        errors: { message: "Movie not found" },
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<typeof movie> = {
      success: true,
      data: movie,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getTopMoviesByVotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = MovieTypes.MovieRecommendedQuerySchema.safeParse(req.query);

    if (!result.success) {
      const errors: IError[] = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const response: ApiResponse<null> = {
        success: false,
        errors,
      };
      res.status(400).json(response);
      return;
    }

    const { limit } = result.data;
    const movies = await MovieService.getTopMoviesByVotes(limit);

    const response: ApiResponse<typeof movies> = {
      success: true,
      data: movies,
    };
    res.status(200).json(response);
    return;
  } catch (error) {
    next(error);
  }
};

export const getMovieShows = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paramsResult = MovieTypes.MovieParamsSchema.safeParse(req.params);
    const queryResult = MovieTypes.MovieShowsQuerySchema.safeParse(req.query);

    if (!paramsResult.success) {
      const errors: IError[] = paramsResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const response: ApiResponse<null> = {
        success: false,
        errors,
      };
      res.status(400).json(response);
      return;
    }

    if (!queryResult.success) {
      const errors: IError[] = queryResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const response: ApiResponse<null> = {
        success: false,
        errors,
      };
      res.status(400).json(response);
      return;
    }

    const { id } = paramsResult.data;
    const { city, date } = queryResult.data;

    const movieShows = await MovieService.getMovieShowsByCityAndDate(
      id,
      city,
      date,
    );

    const response: ApiResponse<typeof movieShows> = {
      success: true,
      data: movieShows,
    };
    res.status(200).json(response);
    return;
  } catch (error) {
    next(error);
  }
};
