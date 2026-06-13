import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import type { ApiResponse, IError } from "../types/response.types.js";
import { HttpError } from "http-errors";
import jwt from "jsonwebtoken";
import { Prisma } from "@repo/db/client";

const { JsonWebTokenError, TokenExpiredError } = jwt;

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
  } else if (
    err instanceof TokenExpiredError ||
    err instanceof JsonWebTokenError
  ) {
    statusCode = 401;
    errors = { message: "Invalid or expired token, please login again" };
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma-specific errors
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        errors = { message: "Unique constraint failed" };
        break;
      case "P2003":
        statusCode = 400;
        errors = { message: "Foreign key constraint failed" };
        break;
      case "P2020":
        statusCode = 400;
        errors = { message: "Value out of range for field type" };
        break;
      case "P2025":
        statusCode = 404;
        errors = { message: "Record not found" };
        break;
      default:
        statusCode = 500;
        errors = { message: `Database error: ${err.message}` };
        break;
    }
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
