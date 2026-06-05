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
    const response: ApiResponse<typeof show> = {
      success: true,
      data: show,
    };

    res.status(201).json(response);
    return;
  } catch (error) {
    next(error);
  }
};

export const getShowsByMovieDateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = ShowTypes.ShowParamsSchem.safeParse(req.params);

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

    const { movieId, location, date } = result.data;

    const shows = await ShowService.getShowsByMovieDateLocation(
      movieId,
      location,
      date,
    );

    const response: ApiResponse<typeof shows> = {
      success: true,
      data: shows,
    };

    res.status(201).json(response);
    return;
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
    const result = ShowTypes.ShowParamsSchem.safeParse(req.params);

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
      throw new Error("Show not found");
    }

    const response: ApiResponse<typeof show> = {
      success: true,
      data: show,
    };

    res.status(200).json(response);
    return;
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
    const result = ShowTypes.ShowQuerySchema.safeParse(req.query);

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

    const { showId, rowId, seatNumber, status } = result.data;

    const updatedShow = await ShowService.updateSeatStatus(
      showId,
      rowId,
      seatNumber,
      status,
    );

    const response: ApiResponse<typeof updatedShow> = {
      success: true,
      data: updatedShow,
    };

    res.status(200).json(response);
    return;
  } catch (error) {
    next(error);
  }
};
