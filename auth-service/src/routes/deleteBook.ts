import express from "express";
import { deleteHobbyController } from "../controllers/deleteHobby";

const router = express.Router();

router.delete("/books/:id", deleteHobbyController);

export { router as deleteBookRouter };
