import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as MovieService from "./movie.service.js";
import * as MovieTypes from "./movie.types.js";
import type { ApiResponse } from "../../types/response.types.js";

export const createMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    // Validate request body with Zod
    const result = MovieTypes.MovieSchema.safeParse(req.body);

    if (!result.success) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          message: "Invalid movie data",
          details: z.treeifyError(result.error),
        },
      };
      return res.status(400).json(response);
    }

    // Call service layer
    const movie = await MovieService.createMovie(result.data);

    // Return created movie
    const response: ApiResponse<typeof movie> = {
      success: true,
      data: movie,
    };
    return res.status(201).json(response);
  } catch (error) {
    // Pass unexpected errors to Express error handler
    next(error);
  }
};

export const getAllMovies = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const movies = await MovieService.getAllMovies();

    const response: ApiResponse<typeof movies> = {
      success: true,
      data: movies,
    };
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const result = MovieTypes.MovieParamsSchema.safeParse(req.params);

    if (!result.success) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          message: "Invalid req params",
          details: z.treeifyError(result.error),
        },
      };
      return res.status(400).json(response);
    }

    const { id } = result.data;
    const movie = await MovieService.getMovieById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const response: ApiResponse<typeof movie> = {
      success: true,
      data: movie,
    };
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getTopMoviesByVotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const result = MovieTypes.MovieParamsSchema.safeParse(req.params);

    if (!result.success) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          message: "Invalid req params",
          details: z.treeifyError(result.error),
        },
      };
      return res.status(400).json(response);
    }

    const { limit } = result.data;
    const movies = await MovieService.getTopMoviesByVotes(limit);

    const response: ApiResponse<typeof movies> = {
      success: true,
      data: movies,
    };
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
