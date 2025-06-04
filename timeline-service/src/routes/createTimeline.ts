import express from "express";
import { requireAuth } from "@heaven-nsoft/common";
import createTimelineExpressValidator from "../expressValidators/createTimeline";
import { validateRequest } from "@heaven-nsoft/my-love-common";
import createTimelineController from "../controllers/createTimeline";

const router = express.Router();

router.post(
  "/timeline",
  createTimelineExpressValidator,
  validateRequest,
  createTimelineController
);

export { router as createTimelineRouter };
