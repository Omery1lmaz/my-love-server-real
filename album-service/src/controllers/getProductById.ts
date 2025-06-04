import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotAuthorizedError } from "@heaven-nsoft/common";
import { Product } from "../models/product";

export const getProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const existProduct = Product.findById(id);

    res
      .status(201)
      .json({ message: "Product successfully created.", data: existProduct });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new NotAuthorizedError());
    }

    console.error(error);
    next(
      new BadRequestError("Product could not be created. Please try again.")
    );
  }
};

export default getProductByIdController;
