import type { Request, Response, NextFunction } from "express";
import type { ApiResponse, IError } from "../../types/response.types.js";
import * as BookingService from "./booking.service.js";
import * as BookingTypes from "./booking.types.js";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        errors: { message: "User is not authenticated" },
      });
      return;
    }

    const result = BookingTypes.CreateBookingSchema.safeParse(req.body);

    if (!result.success) {
      const errors: IError[] = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const response: ApiResponse<null> = { success: false, errors };
      res.status(400).json(response);
      return;
    }

    const booking = await BookingService.createBooking(
      req.user.id,
      result.data,
    );
    const response: ApiResponse<typeof booking> = {
      success: true,
      data: booking,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        errors: { message: "User is not authenticated" },
      });
      return;
    }

    const bookings = await BookingService.getMyBookings(req.user.id);
    const response: ApiResponse<typeof bookings> = {
      success: true,
      data: bookings,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
