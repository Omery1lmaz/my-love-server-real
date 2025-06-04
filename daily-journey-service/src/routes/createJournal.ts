import express from "express";
import { validateRequest } from "@heaven-nsoft/my-love-common";
import createJournalController from "../controllers/createJournal";
import createJournalExpressValidator from "../expressValidators/createJournal";

const router = express.Router();

router.post(
  "/create-journal",
  createJournalExpressValidator,
  validateRequest,
  createJournalController
);

export { router as createJournalRouter };
