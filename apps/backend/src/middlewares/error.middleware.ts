import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import type { ApiResponse, IError } from "../types/response.types.js";
import { HttpError } from "http-errors";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let errors: IError | IError[] = {
    message: "Something went wrong",
  };

  if (err instanceof ZodError) {
    statusCode = 400;
    errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  } else if (err instanceof HttpError) {
    statusCode = err.statusCode || 400;
    errors = { message: err.message };
  } else if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
    statusCode = 401;
    errors = { message: "Invalid or expired token, please login again" };
  } else if (err instanceof Error) {
    errors = {
      message: err.message,
    };
  }

  const response: ApiResponse<null> = {
    success: false,
    errors,
  };

  res.status(statusCode).json(response);
};
