import type { Request, Response, NextFunction } from "express";
import * as TheaterService from "./theater.service.js";
import * as TheaterTypes from "./theater.types.js";
import type { ApiResponse, IError } from "../../types/response.types.js";

export const createTheater = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = TheaterTypes.TheaterSchema.safeParse(req.body);

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

    const theater = await TheaterService.createTheater(result.data);

    const response: ApiResponse<typeof theater> = {
      success: true,
      data: theater,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllTheaters = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const theaters = await TheaterService.getAllTheaters();

    const response: ApiResponse<typeof theaters> = {
      success: true,
      data: theaters,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getTheaterById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = TheaterTypes.TheaterParamsSchema.safeParse(req.params);

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
    const theater = await TheaterService.getTheaterById(id);

    if (!theater) {
      const response: ApiResponse<null> = {
        success: false,
        errors: { message: "Theater not found" },
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<typeof theater> = {
      success: true,
      data: theater,
    };
    res.status(200).json(response);
    return;
  } catch (error) {
    next(error);
  }
};

export const getTheaterByState = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = TheaterTypes.TheaterParamsSchema.safeParse(req.params);

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

    const { state } = result.data;
    const theaters = await TheaterService.getTheaterByState(state);

    const response: ApiResponse<typeof theaters> = {
      success: true,
      data: theaters,
    };
    res.status(200).json(response);
    return;
  } catch (error) {
    next(error);
  }
};
