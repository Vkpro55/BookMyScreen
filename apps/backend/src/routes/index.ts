import express from "express";
import type { Router } from "express";
import movieRouter from "../modules/movie/movie.route.js";
import theaterRouter from "../modules/theatre/theater.route.js";

const router: Router = express.Router();

router.use("/movies", movieRouter);
router.use("/theaters", theaterRouter);

export default router;
