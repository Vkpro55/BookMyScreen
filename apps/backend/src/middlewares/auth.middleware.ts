import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import * as TokenService from "../modules/auth/token.service.js";
import * as UserService from "../modules/user/user.service.js";

export const isVerifiedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return next(new createHttpError.Unauthorized("Access token is missing"));
    }

    if (typeof accessToken !== "string") {
      return next(
        new createHttpError.Unauthorized("Access token type is invalid"),
      );
    }

    const decodedToken = TokenService.verifyAccessToken(accessToken);

    let user;
    if ("id" in decodedToken && typeof decodedToken.id === "string") {
      user = await UserService.getUserById(decodedToken.id);
    }

    if (!user) {
      return next(new createHttpError.Unauthorized("User not found"));
    }

    req.user = user;
    next();
  } catch {
    return next(new createHttpError.Unauthorized("Invalid or expired token"));
  }
};
