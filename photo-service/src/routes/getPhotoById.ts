import express from "express";
import getPhotoByIdController from "../controllers/getPhotoById";

const router = express.Router();

router.get("/photos/:photoId", getPhotoByIdController);

export { router as getPhotoByIdRouter };
