import express from "express";
import { userAlbums } from "../controllers/userAlbums";
import upload from "../utils/multer-s3/upload";
import { requireAuth } from "@heaven-nsoft/my-love-common";

const router = express.Router();

router.get("/user-albums", userAlbums);

export { router as userAlbumRouter };
