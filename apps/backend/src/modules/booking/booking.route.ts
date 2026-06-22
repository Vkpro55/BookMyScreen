import express from "express";
import type { Router } from "express";
import { isVerifiedUser } from "../../middlewares/auth.middleware.js";
import * as BookingController from "./booking.controller.js";

const router: Router = express.Router();

router.post("/", isVerifiedUser, BookingController.createBooking);
router.get("/my", isVerifiedUser, BookingController.getMyBookings);

export default router;
