import express from "express";
import getAlbumById from "../controllers/getAlbumById";

const router = express.Router();

router.get("/get-album-by-id/:id", getAlbumById);

export { router as getAlbumByIdRouter };
