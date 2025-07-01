import express from "express";
import upload from "../utils/multer-s3/upload";
import uploadMultiPhotoTimelineController from "../controllers/uploadMultiPhotoTimeline";
import uploadMultiPhotoDailyJourneyController from "../controllers/uploadMultiPhotoDailyJourney";

const router = express.Router();

router.post(
  "/upload-multi-daily-journey",
  upload.array("photo", 10),
  uploadMultiPhotoDailyJourneyController
);

export { router as uploadMultiPhotoDailyJourneyRouter };