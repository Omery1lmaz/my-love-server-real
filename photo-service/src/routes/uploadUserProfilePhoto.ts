import express from "express";
import uploadPhotoController from "../controllers/uploadPhoto";
import upload from "../utils/multer-s3/upload";
import { uploadUserPhotoController } from "../controllers/uploadUserPhoto";

const router = express.Router();

router.post("/upload/user/profile", upload.single("photo"), uploadUserPhotoController);

export { router as uploadUserProfilePhotoRouter };
