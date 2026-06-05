import * as ShowController from "./show.controller.js";
import express from "express";
import type { Router } from "express";

const router: Router = express.Router();

router.post("/", ShowController.createShow);
router.get("/", ShowController.getShowsByMovieDateLocation);
router.get("/:id", ShowController.getShowById);

export default router;
