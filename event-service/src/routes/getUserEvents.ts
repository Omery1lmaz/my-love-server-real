import express from "express";
import getEventsController from "../controllers/getEvents";

const router = express.Router();

router.get("/events", getEventsController);

export { router as getUserEventsRouter };
