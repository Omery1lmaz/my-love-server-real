import express from "express";
import uploadPhotoController from "../controllers/uploadPhoto";
import upload from "../utils/multer-s3/upload";

const router = express.Router();

router.post("/upload", upload.single("photo"), uploadPhotoController);

export { router as uploadPhotoRouter };
