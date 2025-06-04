import express from "express";
import { updateInterests } from "../controllers/interests";

const router = express.Router();

router.put("/update-interests", updateInterests);

export { router as interestsRouter };
