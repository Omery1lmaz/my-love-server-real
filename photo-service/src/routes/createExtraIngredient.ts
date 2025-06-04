import express from "express";
import createExtraIngredientController from "../controllers/createExtraIngredient";

const router = express.Router();

router.post("/create", createExtraIngredientController);

export { router as createExtraIngredientRouter };
