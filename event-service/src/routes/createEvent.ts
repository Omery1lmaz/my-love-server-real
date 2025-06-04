import express from "express";
import { validateRequest } from "@heaven-nsoft/common";
import createEventExpressValidator from "../expressValidators/createEvent";
import createEventController from "../controllers/createEvent";
import upload from "../utils/multer-s3/upload";

const router = express.Router();

router.post(
  "/create-event",
  // upload.array("photo", 10),
  // createEventExpressValidator,
  // validateRequest,
  createEventController
);

export { router as createEventRouter };
