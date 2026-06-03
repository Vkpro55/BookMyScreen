import express from "express";
import type { Router } from "express";
import movieRouter from "../modules/movie/movie.route.js";

const router: Router = express.Router();

router.use("/movies", movieRouter);

export default router;
