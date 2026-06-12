import type { User } from "@repo/db/client";

declare module "express" {
  interface Request {
    user?: User;
  }
}
