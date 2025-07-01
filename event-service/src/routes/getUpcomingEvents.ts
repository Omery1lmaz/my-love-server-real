import express from "express";
import getUpcomingEventsController from "../controllers/getUpcomingEvents";

const router = express.Router();

router.get("/upcoming", getUpcomingEventsController);

export { router as getUpcomingEventsRouter }; 