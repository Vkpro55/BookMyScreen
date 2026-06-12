import type { Request, Response, NextFunction } from "express";
import * as UserService from "./user.service.js";
import * as UserTypes from "./user.types.js";
import type { ApiResponse, IError } from "../../types/response.types.js";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = UserTypes.UserSchema.safeParse(req.body);

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

    const user = await UserService.createUser(result.data);

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await UserService.getAllUsers();

    const response: ApiResponse<typeof users> = {
      success: true,
      data: users,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const user = await UserService.getUserById(req.user.id);

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        errors: { message: "User not found" },
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = UserTypes.UserEmailQuerySchema.safeParse(req.query);

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

    const { email } = result.data;
    const user = await UserService.getUserByEmail(email);

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        errors: { message: "User not found" },
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const paramsResult = UserTypes.UserParamsSchema.safeParse(req.params);
    const bodyResult = UserTypes.ActivateUserSchema.safeParse(req.body);

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

    if (!bodyResult.success) {
      const errors: IError[] = bodyResult.error.issues.map((issue) => ({
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
    const user = await UserService.activateUser(id, bodyResult.data);

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        errors: { message: "User not found" },
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
