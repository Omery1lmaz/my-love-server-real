import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@heaven-nsoft/common";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";
import { ExtraIngredientCreatedPublisher } from "../events/publishers/extra-ingredient-created-publisher";

export const createExtraIngredientController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ test: "(req.file as any).location" });
};

export default createExtraIngredientController;
