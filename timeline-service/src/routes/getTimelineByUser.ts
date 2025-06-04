import express from "express";
import createTimelineController from "../controllers/createTimeline";

const router = express.Router();

router.get("/timeline", createTimelineController);

export { router as createTimelineRouter };
