import { config } from "../../config/config.js";
import type { PaymentData, VerifyPayment } from "./payment.types.js";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import createHttpError from "http-errors";
import prisma, { PaymentOrderStatus, Prisma } from "@repo/db/client";

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: "created" | "attempted" | "paid";
  attempts: number;
  notes: Record<string, unknown>;
  created_at: number;
}

interface RazorpayPaymentResponse {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "failed" | "refunded";
  captured: boolean;
  error_description?: string | null;
}

interface RazorpayPaymentCollection {
  entity: "collection";
  count: number;
  items: RazorpayPaymentResponse[];
}

interface WebhookInput {
  rawBody: Buffer;
  signature: string;
  eventId: string;
}

const PROCESSING_RETRY_AFTER_MS = 60_000;

const razorpayInstance = new Razorpay({
  key_id: config.razorpay_key_id,
  key_secret: config.razprpay_key_secret,
});

const hashPaymentRequest = (paymentData: PaymentData): string => {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify({ amount: paymentData.amount, currency: "INR" }))
    .digest("hex");
};

const createReceipt = (): string => {
  return `bms_${crypto.randomUUID().replaceAll("-", "")}`;
};

const isStale = (date: Date, staleAfterMs: number): boolean => {
  return Date.now() - date.getTime() > staleAfterMs;
};

const toOrderResponse = (order: {
  razorpayOrderId: string | null;
  amount: number;
  currency: string;
  receipt: string;
  status: PaymentOrderStatus;
}) => ({
  id: order.razorpayOrderId ?? "",
  amount: order.amount,
  currency: order.currency,
  receipt: order.receipt,
  status: order.status,
});

const requireWebhookSecret = () => {
  if (!config.razorpay_webhook_secret) {
    throw createHttpError(500, "Razorpay webhook secret is not configured");
  }
};

const safeCompare = (expected: string, received: string): boolean => {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
};

const verifyWebhookSignature = (rawBody: Buffer, signature: string): void => {
  requireWebhookSecret();

  const expectedSignature = crypto
    .createHmac("sha256", config.razorpay_webhook_secret)
    .update(rawBody)
    .digest("hex");

  if (!safeCompare(expectedSignature, signature)) {
    throw createHttpError(400, "Invalid Razorpay webhook signature");
  }
};

const verifyCheckoutSignature = (paymentData: VerifyPayment): void => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    paymentData;

  const expectedSignature = crypto
    .createHmac("sha256", config.razprpay_key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (!safeCompare(expectedSignature, razorpay_signature)) {
    throw createHttpError(400, "Invalid payment signature");
  }
};

const statusFromPayment = (
  payment: RazorpayPaymentResponse,
): PaymentOrderStatus => {
  if (payment.status === "captured" || payment.captured) {
    return PaymentOrderStatus.PAID;
  }

  if (payment.status === "authorized") {
    return PaymentOrderStatus.AUTHORIZED;
  }

  if (payment.status === "failed") {
    return PaymentOrderStatus.FAILED;
  }

  return PaymentOrderStatus.ATTEMPTED;
};

const statusRank: Record<PaymentOrderStatus, number> = {
  [PaymentOrderStatus.PROCESSING]: 0,
  [PaymentOrderStatus.UNKNOWN]: 0,
  [PaymentOrderStatus.CREATED]: 1,
  [PaymentOrderStatus.ATTEMPTED]: 2,
  [PaymentOrderStatus.FAILED]: 2,
  [PaymentOrderStatus.AUTHORIZED]: 3,
  [PaymentOrderStatus.PAID]: 4,
};

const mergeStatus = (
  currentStatus: PaymentOrderStatus,
  incomingStatus: PaymentOrderStatus,
): PaymentOrderStatus => {
  if (currentStatus === PaymentOrderStatus.PAID) {
    return PaymentOrderStatus.PAID;
  }

  if (
    currentStatus === PaymentOrderStatus.AUTHORIZED &&
    incomingStatus === PaymentOrderStatus.FAILED
  ) {
    return currentStatus;
  }

  return statusRank[incomingStatus] >= statusRank[currentStatus]
    ? incomingStatus
    : currentStatus;
};

const strongestStatusFromPayments = (
  payments: RazorpayPaymentResponse[],
): PaymentOrderStatus => {
  if (
    payments.some(
      (payment) => statusFromPayment(payment) === PaymentOrderStatus.PAID,
    )
  ) {
    return PaymentOrderStatus.PAID;
  }

  if (
    payments.some(
      (payment) => statusFromPayment(payment) === PaymentOrderStatus.AUTHORIZED,
    )
  ) {
    return PaymentOrderStatus.AUTHORIZED;
  }

  if (payments.length > 0) {
    return payments.every(
      (payment) => statusFromPayment(payment) === PaymentOrderStatus.FAILED,
    )
      ? PaymentOrderStatus.FAILED
      : PaymentOrderStatus.ATTEMPTED;
  }

  return PaymentOrderStatus.CREATED;
};

const getGatewayErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const getReusableOrder = async (
  idempotencyKey: string,
  requestHash: string,
) => {
  const existingOrder = await prisma.paymentOrder.findUnique({
    where: { idempotencyKey },
  });

  if (!existingOrder) return null;

  if (existingOrder.requestHash !== requestHash) {
    throw createHttpError(
      409,
      "Idempotency key was already used with different payment data",
    );
  }

  if (existingOrder.razorpayOrderId) {
    return existingOrder;
  }

  if (!isStale(existingOrder.updatedAt, PROCESSING_RETRY_AFTER_MS)) {
    throw createHttpError(
      409,
      "Payment order creation is in progress. Please retry shortly.",
    );
  }

  return existingOrder;
};

const createOrReuseLocalOrder = async (
  paymentData: PaymentData,
  requestHash: string,
) => {
  const reusableOrder = await getReusableOrder(
    paymentData.idempotencyKey,
    requestHash,
  );

  if (reusableOrder?.razorpayOrderId) {
    return reusableOrder;
  }

  if (reusableOrder) {
    return prisma.paymentOrder.update({
      where: { id: reusableOrder.id },
      data: {
        receipt: createReceipt(),
        status: PaymentOrderStatus.PROCESSING,
        lastError: null,
      },
    });
  }

  try {
    return await prisma.paymentOrder.create({
      data: {
        amount: paymentData.amount,
        currency: "INR",
        receipt: createReceipt(),
        idempotencyKey: paymentData.idempotencyKey,
        requestHash,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return getReusableOrder(paymentData.idempotencyKey, requestHash);
    }

    throw error;
  }
};

export const createOrder = async (paymentData: PaymentData) => {
  const requestHash = hashPaymentRequest(paymentData);
  const paymentOrder = await createOrReuseLocalOrder(paymentData, requestHash);

  if (!paymentOrder) {
    throw createHttpError(500, "Unable to create payment order");
  }

  if (paymentOrder.razorpayOrderId) {
    return toOrderResponse(paymentOrder);
  }

  try {
    const razorpayOrder = (await razorpayInstance.orders.create({
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      receipt: paymentOrder.receipt,
    })) as RazorpayOrderResponse;

    const updatedPaymentOrder = await prisma.paymentOrder.update({
      where: { id: paymentOrder.id },
      data: {
        razorpayOrderId: razorpayOrder.id,
        status: PaymentOrderStatus.CREATED,
        rawResponse: razorpayOrder as unknown as Prisma.InputJsonValue,
        lastError: null,
      },
    });

    return toOrderResponse(updatedPaymentOrder);
  } catch (error) {
    await prisma.paymentOrder.update({
      where: { id: paymentOrder.id },
      data: {
        status: PaymentOrderStatus.UNKNOWN,
        lastError: getGatewayErrorMessage(error),
      },
    });

    throw createHttpError(
      503,
      "Payment gateway response is unknown. Please retry shortly.",
    );
  }
};

export const verifyPayment = async (paymentData: VerifyPayment) => {
  verifyCheckoutSignature(paymentData);

  try {
    const payment = (await razorpayInstance.payments.fetch(
      paymentData.razorpay_payment_id,
    )) as RazorpayPaymentResponse;
    const localOrder = await prisma.paymentOrder.findUnique({
      where: { razorpayOrderId: paymentData.razorpay_order_id },
    });

    return prisma.paymentOrder.update({
      where: { razorpayOrderId: paymentData.razorpay_order_id },
      data: {
        status: mergeStatus(
          localOrder?.status ?? PaymentOrderStatus.CREATED,
          statusFromPayment(payment),
        ),
        razorpayPaymentId: payment.id,
        rawResponse: payment as unknown as Prisma.InputJsonValue,
        lastError: payment.error_description ?? null,
      },
    });
  } catch (error) {
    const localOrder = await prisma.paymentOrder.findUnique({
      where: { razorpayOrderId: paymentData.razorpay_order_id },
    });

    if (localOrder?.razorpayOrderId) {
      try {
        return await reconcileOrder(localOrder.razorpayOrderId);
      } catch {
        // Keep the order recoverable for webhook or manual reconciliation.
      }
    }

    return prisma.paymentOrder.update({
      where: { razorpayOrderId: paymentData.razorpay_order_id },
      data: {
        status: mergeStatus(
          localOrder?.status ?? PaymentOrderStatus.CREATED,
          PaymentOrderStatus.UNKNOWN,
        ),
        razorpayPaymentId: paymentData.razorpay_payment_id,
        lastError: getGatewayErrorMessage(error),
      },
    });
  }
};

export const reconcileOrder = async (razorpayOrderId: string) => {
  const paymentCollection = (await razorpayInstance.orders.fetchPayments(
    razorpayOrderId,
  )) as RazorpayPaymentCollection;

  const status = strongestStatusFromPayments(paymentCollection.items);
  const localOrder = await prisma.paymentOrder.findUnique({
    where: { razorpayOrderId },
  });
  const capturedPayment = paymentCollection.items.find(
    (payment) => statusFromPayment(payment) === PaymentOrderStatus.PAID,
  );
  const authorizedPayment = paymentCollection.items.find(
    (payment) => statusFromPayment(payment) === PaymentOrderStatus.AUTHORIZED,
  );
  const latestPayment = capturedPayment ?? authorizedPayment;

  return prisma.paymentOrder.update({
    where: { razorpayOrderId },
    data: {
      status: mergeStatus(
        localOrder?.status ?? PaymentOrderStatus.CREATED,
        status,
      ),
      razorpayPaymentId: latestPayment?.id,
      rawResponse: paymentCollection as unknown as Prisma.InputJsonValue,
      lastReconciledAt: new Date(),
      lastError:
        status === PaymentOrderStatus.FAILED
          ? paymentCollection.items[0]?.error_description
          : null,
    },
  });
};

export const reconcileOrderByIdempotencyKey = async (
  idempotencyKey: string,
) => {
  const localOrder = await prisma.paymentOrder.findUnique({
    where: { idempotencyKey },
  });

  if (!localOrder) {
    throw createHttpError(404, "Payment order not found");
  }

  if (!localOrder.razorpayOrderId) {
    return localOrder;
  }

  return reconcileOrder(localOrder.razorpayOrderId);
};

export const handleWebhook = async ({
  rawBody,
  signature,
  eventId,
}: WebhookInput) => {
  verifyWebhookSignature(rawBody, signature);

  const payload = JSON.parse(rawBody.toString("utf8")) as {
    event: string;
    payload?: {
      payment?: { entity?: RazorpayPaymentResponse };
      order?: { entity?: RazorpayOrderResponse };
    };
  };

  const payment = payload.payload?.payment?.entity;
  const order = payload.payload?.order?.entity;
  const razorpayOrderId = payment?.order_id ?? order?.id;
  const razorpayPaymentId = payment?.id;

  try {
    const localOrder = razorpayOrderId
      ? await prisma.paymentOrder.findUnique({
          where: { razorpayOrderId },
        })
      : null;

    await prisma.paymentWebhookEvent.create({
      data: {
        eventId,
        eventType: payload.event,
        razorpayOrderId,
        razorpayPaymentId,
        payload: payload as unknown as Prisma.InputJsonValue,
        paymentOrderId: localOrder?.id,
      },
    });

    if (payment && razorpayOrderId && localOrder) {
      const incomingStatus = statusFromPayment(payment);

      await prisma.paymentOrder.update({
        where: { id: localOrder.id },
        data: {
          status: mergeStatus(localOrder.status, incomingStatus),
          razorpayPaymentId,
          lastWebhookEvent: eventId,
          rawResponse: payment as unknown as Prisma.InputJsonValue,
          lastError: payment.error_description ?? null,
        },
      });
    }

    return { processed: true, duplicate: false, eventId };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { processed: true, duplicate: true, eventId };
    }

    throw error;
  }
};
