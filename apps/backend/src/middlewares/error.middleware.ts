import type { Request, Response } from "express";
import { ZodError } from "zod";
import type { ApiResponse, IError } from "../types/response.types.js";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
) => {
  let statusCode = 500;
  let errors: IError | IError[] = { message: "Something went wrong" };

  if (err instanceof ZodError) {
    statusCode = 400;
    errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  } else if (err instanceof Error) {
    errors = { message: err.message };
  }

  const response: ApiResponse<null> = {
    success: false,
    errors,
  };

  return res.status(statusCode).json(response);
};
