import { z } from "zod";

export const RoleEnum = z.enum(["admin", "user"]);

export const UserSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  phone: z.number().int().optional(),
  role: RoleEnum,
});

export type UserInput = z.infer<typeof UserSchema>;

export const UserParamsSchema = z.object({
  id: z.cuid2("Invalid user ID"),
});

export const UserEmailQuerySchema = z.object({
  email: z.email("Invalid email address"),
});

export const ActivateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.number().int(),
  activateUser: z.boolean(),
});
