import express from "express";
import type { Router } from "express";
import * as PaymentController from "./payment.controller.js";

const router: Router = express.Router();

router.post("/orders", PaymentController.createOrder);
router.post("/verify", PaymentController.verifyPayment);
router.post("/webhook", PaymentController.handleWebhook);
router.post(
  "/orders/:razorpayOrderId/reconcile",
  PaymentController.reconcileOrder,
);

export default router;
