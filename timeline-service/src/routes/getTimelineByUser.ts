import express from "express";
import createTimelineController from "../controllers/createTimeline";
import { getTimeLineByUser } from "../controllers/getTimelineByUser";

const router = express.Router();

router.get("/timeline", getTimeLineByUser);

export { router as getTimelineByUserRouter };
