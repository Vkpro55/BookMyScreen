import { z } from "zod";

export const CreateBookingSchema = z.object({
  razorpayOrderId: z.string().min(1, "Razorpay order ID is required"),
  showId: z.string().min(1, "Show ID is required"),
  seats: z
    .array(
      z.object({
        seatId: z.string().min(1, "Seat ID is required"),
        seatNumber: z.string().min(1, "Seat number is required"),
      }),
    )
    .min(1, "At least one seat is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
