import { z } from "zod";

const JoinShowSchema = z.object({
  type: z.literal("join-show"),
  showId: z.string(),
});

const LockSeatsSchema = z.object({
  type: z.literal("lock-seats"),
  showId: z.string(),
  seatIds: z.array(z.string()),
  userId: z.string(),
});

const UnlockedSeatsSchema = z.object({
  type: z.literal("unlock-seats"),
  showId: z.string(),
  seatIds: z.array(z.string()),
  userId: z.string(),
});

export const MessageSchema = z.union([
  JoinShowSchema,
  LockSeatsSchema,
  UnlockedSeatsSchema,
]);

export type Message = z.infer<typeof MessageSchema>;
