import * as UserController from "./user.controller.js";
import express from "express";
import type { Router } from "express";

const router: Router = express.Router();

router.post("/", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.patch("/activate/:id", UserController.activateUser);
router.get("/:id", UserController.getUserById);

export default router;
