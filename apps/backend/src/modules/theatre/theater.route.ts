import * as TheaterController from "./theater.controller.js";
import express from "express";
import type { Router } from "express";

const router: Router = express.Router();

router.post("/", TheaterController.createTheater);
router.get("/", TheaterController.getAllTheaters);

export default router;
