import * as TheaterController from "./theater.controller.js";
import express from "express";
import type { Router } from "express";

const router: Router = express.Router();

router.post("/", TheaterController.createTheater);
router.get("/", TheaterController.getAllTheaters);

router.get("/city/:city", TheaterController.getTheaterByCity);
router.get("/state/:state", TheaterController.getTheaterByState);

router.post("/:id/screens", TheaterController.createScreen);
router.get("/:id/screens", TheaterController.getScreensByTheater);
router.get("/:id/screens/:screenId", TheaterController.getScreenById);

router.get("/:id", TheaterController.getTheaterById);

export default router;
