import express from "express";
import { validateRequest } from "@heaven-nsoft/common";
import getJournalDetailController from "../controllers/getJournalDetail";

const router = express.Router();

router.get("/journal/:id", validateRequest, getJournalDetailController);

export { router as getJournalDetailRouter };
