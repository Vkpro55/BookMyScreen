import { z } from "zod";

export const PaymentDataSchema = z.object({
  amount: z.number().int().positive("Amount must be a positive number"),
  idempotencyKey: z
    .string()
    .trim()
    .min(16, "Idempotency key must be at least 16 characters")
    .max(120, "Idempotency key is too long"),
});

export type PaymentData = z.infer<typeof PaymentDataSchema>;

export const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, "Order ID is required"),
  razorpay_payment_id: z.string().min(1, "Payment ID is required"),
  razorpay_signature: z.string().min(1, "Signature is required"),
});

export type VerifyPayment = z.infer<typeof VerifyPaymentSchema>;

export const PaymentOrderParamsSchema = z.object({
  razorpayOrderId: z.string().min(1, "Order ID is required"),
});

export type PaymentOrderParams = z.infer<typeof PaymentOrderParamsSchema>;

export const PaymentOrderLookupSchema = z.object({
  idempotencyKey: z
    .string()
    .trim()
    .min(16, "Idempotency key must be at least 16 characters")
    .max(120, "Idempotency key is too long"),
});

export type PaymentOrderLookup = z.infer<typeof PaymentOrderLookupSchema>;
