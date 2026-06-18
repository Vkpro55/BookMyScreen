import type { Request, Response, NextFunction } from "express";
import type { ApiResponse, IError } from "../../types/response.types.js";
import * as PaymentService from "./payment.service.js";
import * as PaymentTypes from "./payment.types.js";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = PaymentTypes.PaymentDataSchema.safeParse(req.body);

    if (!result.success) {
      const errors: IError[] = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const response: ApiResponse<null> = { success: false, errors };
      res.status(400).json(response);
      return;
    }

    const order = await PaymentService.createOrder(result.data);
    const response: ApiResponse<typeof order> = {
      success: true,
      data: order,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = PaymentTypes.VerifyPaymentSchema.safeParse(req.body);

    if (!result.success) {
      const errors: IError[] = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const response: ApiResponse<null> = { success: false, errors };
      res.status(400).json(response);
      return;
    }

    const payment = await PaymentService.verifyPayment(result.data);
    const response: ApiResponse<typeof payment> = {
      success: true,
      data: payment,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const signature = req.header("x-razorpay-signature");
    const eventId = req.header("x-razorpay-event-id");

    if (!signature || !eventId) {
      res.status(400).json({
        success: false,
        errors: { message: "Missing Razorpay webhook headers" },
      });
      return;
    }

    if (!Buffer.isBuffer(req.body)) {
      res.status(400).json({
        success: false,
        errors: { message: "Webhook body must be raw bytes" },
      });
      return;
    }

    const event = await PaymentService.handleWebhook({
      rawBody: req.body,
      signature,
      eventId,
    });

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const reconcileOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = PaymentTypes.PaymentOrderParamsSchema.safeParse(req.params);

    if (!result.success) {
      const errors: IError[] = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      const response: ApiResponse<null> = { success: false, errors };
      res.status(400).json(response);
      return;
    }

    const order = await PaymentService.reconcileOrder(
      result.data.razorpayOrderId,
    );
    const response: ApiResponse<typeof order> = {
      success: true,
      data: order,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
