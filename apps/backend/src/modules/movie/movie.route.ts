import * as MovieController from "./movie.controller.js";
import express from "express";
import type { Router } from "express";

const router: Router = express.Router();

router.post("/", MovieController.createMovie);
router.get("/", MovieController.getAllMovies);
router.get("/recommended", MovieController.getTopMoviesByVotes);
router.get("/:id", MovieController.getMovieById);

export default router;
