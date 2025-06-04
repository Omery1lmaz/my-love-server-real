import express from "express";
import { validateRequest } from "@heaven-nsoft/my-love-common";
import getUserJournalsController from "../controllers/getUserJournals";

const router = express.Router();

router.get("/my-journals", validateRequest, getUserJournalsController);

export { router as getUserJournalsRouter };
