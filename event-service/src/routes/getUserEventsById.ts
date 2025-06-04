import express from "express";
import getUserEventsByIdController from "../controllers/getUserEventsById";
import getEventByIdExpressValidator from "../expressValidators/getUserEventsById";
import { validateRequest } from "@heaven-nsoft/my-love-common";

const router = express.Router();

router.get(
  "/event/:id",
  getEventByIdExpressValidator,
  validateRequest,
  getUserEventsByIdController
);

export { router as getUserEventByIdRouter };
