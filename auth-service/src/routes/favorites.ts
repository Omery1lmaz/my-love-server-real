import express from "express";
import { updateFavorites } from "../controllers/favorites";

const router = express.Router();

router.put("/update-favorites", updateFavorites);

export { router as favoritesRouter };
