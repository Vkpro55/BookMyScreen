import { z } from "zod";
import { isValidEmail } from "../../utils/validation.js";

export const SendOtpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine(isValidEmail, { message: "Invalid email address" }),
});

export type SendOtpInput = z.infer<typeof SendOtpSchema>;

export const VerifyOtpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine(isValidEmail, { message: "Invalid email address" }),
  otp: z.string(),
  hash: z.string(),
});

export interface IOtpPayload {
  email: string;
  code: string;
}

export interface ITokenPayload {
  id: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}
