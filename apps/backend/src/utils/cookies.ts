import type { Request } from "express";

export const getCookie = (req: Request, name: string): string | undefined => {
  if (!("cookies" in req)) {
    return undefined;
  }

  const cookies: unknown = req.cookies;

  if (!cookies || typeof cookies !== "object") {
    return undefined;
  }

  const value = (cookies as Record<string, unknown>)[name];
  return typeof value === "string" ? value : undefined;
};
