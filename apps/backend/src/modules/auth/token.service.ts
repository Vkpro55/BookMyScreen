import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";
import type { ITokenPayload } from "./auth.types.js";
import prisma from "@repo/db/client";
import type { RefreshToken } from "@repo/db/client";
import type { JwtPayload } from "jsonwebtoken";

export const generateToken = (
  payload: ITokenPayload,
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(payload, config.access_jwt_secret, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(payload, config.refresh_jwt_secret, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const storeRefreshTokenInDB = async (
  userId: string,
  refreshToken: string,
): Promise<void> => {
  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
    },
  });
};

export const verifyAccessToken = (
  token: string,
): ITokenPayload | JwtPayload => {
  const decoded = jwt.verify(token, config.access_jwt_secret);

  if (typeof decoded === "string") {
    throw new Error("Unexpected string payload from jwt.verify");
  }

  return decoded;
};

export const verifyRefreshToken = (token: string): ITokenPayload => {
  const decoded = jwt.verify(token, config.refresh_jwt_secret);

  if (typeof decoded === "string") {
    throw new Error("Unexpected string payload from jwt.verify");
  }

  const { id, email, phone, role } = decoded;

  if (typeof id !== "string") {
    throw new Error("Invalid token payload: missing user id");
  }

  return {
    id,
    email: typeof email === "string" ? email : undefined,
    phone: typeof phone === "string" ? phone : undefined,
    role: typeof role === "string" ? role : undefined,
  };
};

export const findRefreshToken = async (
  userId: string,
  refreshToken: string,
): Promise<RefreshToken | null> => {
  return await prisma.refreshToken.findFirst({
    where: { userId, token: refreshToken },
  });
};

export const deleteRefreshToken = async (
  refreshToken: string,
): Promise<RefreshToken | null> => {
  return await prisma.refreshToken.delete({ where: { token: refreshToken } });
};

export const updateRefreshToken = async (
  userId: string,
  refreshToken: string,
): Promise<void> => {
  await prisma.refreshToken.update({
    where: { userId },
    data: { token: refreshToken },
  });
};
