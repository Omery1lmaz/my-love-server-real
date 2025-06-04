import express from "express";
import updateUserPhotoMoment from "../controllers/updateUserPhotoMoment";

const router = express.Router();

router.put("/photos/moment/:photoId", updateUserPhotoMoment);

export { router as updateUserPhotoMomentRouter };
