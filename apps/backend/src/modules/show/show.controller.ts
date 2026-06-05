import type { Request, Response, NextFunction } from "express";
import * as ShowTypes from "./show.types.js";
import * as ShowService from "./show.service.js";
import type { IError, ApiResponse } from "../../types/response.types.js";

export const createShow = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = ShowTypes.ShowSchema.safeParse(req.body);

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

    const show = await ShowService.createShow(result.data);

    if (!show) {
      const response: ApiResponse<null> = {
        success: false,
        errors: { message: "Movie or screen not found" },
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<typeof show> = {
      success: true,
      data: show,
    };

    res.status(201).json(response);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Price missing for row label")
    ) {
      const response: ApiResponse<null> = {
        success: false,
        errors: { message: error.message },
      };
      res.status(400).json(response);
      return;
    }
    next(error);
  }
};

export const getShowsByMovieCityAndDate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = ShowTypes.ShowListQuerySchema.safeParse(req.query);

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

    const { movieId, city, date } = result.data;

    const shows = await ShowService.getShowsByMovieCityAndDate(
      movieId,
      city,
      date,
    );

    const response: ApiResponse<typeof shows> = {
      success: true,
      data: shows,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getShowById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = ShowTypes.ShowParamsSchema.safeParse(req.params);

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

    const show = await ShowService.getShowById(id);

    if (!show) {
      const response: ApiResponse<null> = {
        success: false,
        errors: { message: "Show not found" },
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<typeof show> = {
      success: true,
      data: show,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateSeatStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = ShowTypes.UpdateSeatStatusSchema.safeParse(req.body);

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

    const { showId, seatId, status } = result.data;

    const updatedSeat = await ShowService.updateSeatStatus(
      showId,
      seatId,
      status,
    );

    if (!updatedSeat) {
      const response: ApiResponse<null> = {
        success: false,
        errors: { message: "Show seat not found" },
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<typeof updatedSeat> = {
      success: true,
      data: updatedSeat,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
