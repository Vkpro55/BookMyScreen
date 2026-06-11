import * as AuthController from "./auth.controller.js";
import express from "express";
import type { Router } from "express";

const router: Router = express.Router();

router.post("/send-otp", AuthController.sendOtp);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/logout", AuthController.logout);

export default router;
