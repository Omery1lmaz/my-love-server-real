import express from "express";
import { validateRequest } from "@heaven-nsoft/common";
import getPartnerJournalsController from "../controllers/getPartnerJournals";

const router = express.Router();

router.get("/partner-journals", validateRequest, getPartnerJournalsController);

export { router as getPartnerJournalsRouter };
