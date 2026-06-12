import * as UserController from "./user.controller.js";
import express from "express";
import type { Router } from "express";
import { isVerifiedUser } from "../../middlewares/auth.middleware.js";

const router: Router = express.Router();

router.post("/", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.patch("/activate/:id", isVerifiedUser, UserController.activateUser);
router.get("/me", isVerifiedUser, UserController.getUserById);

export default router;
