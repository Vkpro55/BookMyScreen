import type { Request, Response, NextFunction } from "express";
import * as AuthTypes from "./auth.types.js";
import * as OtpService from "./opt.service.js";
import * as TokenService from "./token.service.js";
import * as UserService from "../user/user.service.js";
import type { ApiResponse, IError } from "../../types/response.types.js";
import { isValidEmail } from "../../utils/validation.js";
import { getCookie } from "../../utils/cookies.js";
import createHttpError from "http-errors";

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = AuthTypes.SendOtpSchema.safeParse(req.body);

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

    if (!isValidEmail(email)) {
      const err = new createHttpError.BadRequest("Invalid email format");
      return next(err);
    }

    // 1. create otp
    const otp = OtpService.generateOtp();

    // 2. Hash Otp with email
    const ttl = 1000 * 60 * 2;
    const expires = Date.now() + ttl;
    const data = `${email}.${otp}.${expires}`;
    const hashedOtp = OtpService.hashOtp(data);

    // 3. Send Otp to email
    await OtpService.sendOtpToEmail(email, hashedOtp);

    // 4. Respond to the client;
    res.json({
      hash: `${hashedOtp}.${expires}`,
      email,
      msg: "OTP sent to email successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = AuthTypes.VerifyOtpSchema.safeParse(req.body);

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

    // 1. OTP verification
    const { email, otp, hash } = result.data;

    const parts = hash.split(".");
    const hashedOTP = parts[0];
    const expires = parts[1];

    if (!hashedOTP) {
      const err = new createHttpError.BadRequest("HashedOTP is mising");
      return next(err);
    }

    if (!expires) {
      const err = new createHttpError.BadRequest("Malformed OTP hash");
      return next(err);
    }

    if (Date.now() > +expires) {
      const err = new createHttpError.Unauthorized("OTP Expired");
      return next(err);
    }

    const data = `${email}.${otp}.${expires}`;
    const isValid = OtpService.verifyOtp(hashedOTP, data);

    if (!isValid) {
      const err = new createHttpError.Unauthorized("Invalid OTP");
      return next(err);
    }

    // 2. Find or create user
    let user = await UserService.getUserByEmail(email);

    user ??= await UserService.createUser({
      email,
      name: "",
      phone: Number(""),
      role: "user",
    });

    // 3. Generate Tokens
    const { accessToken, refreshToken } = TokenService.generateToken({
      id: user.id,
      email: user.email,
    });

    // 4.Store refresh token in the db
    await TokenService.storeRefreshTokenInDB(user.id, refreshToken);

    // 5. Send tokens in the cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.json({ auth: true, user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshTokenFromCookies = getCookie(req, "refreshToken");

    if (!refreshTokenFromCookies) {
      return next(
        new createHttpError.Unauthorized(
          "Refresh token not found, please login again",
        ),
      );
    }

    const decodedToken = TokenService.verifyRefreshToken(
      refreshTokenFromCookies,
    );

    const token = await TokenService.findRefreshToken(
      decodedToken.id,
      refreshTokenFromCookies,
    );

    if (!token) {
      return next(
        new createHttpError.Unauthorized(
          "Refresh token not found in database, please login again",
        ),
      );
    }

    const { accessToken, refreshToken } = TokenService.generateToken({
      id: decodedToken.id,
    });

    await TokenService.updateRefreshToken(decodedToken.id, refreshToken);

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({ auth: true });
  } catch (error) {
    next(error);
  }
};
