import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@heaven-nsoft/common";
import { Product } from "../models/product";

export const getProductsBySellerLimitController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const products = Product.find({ seller: id })
      .populate({
        path: "user",
        select: "name",
      })
      .populate({
        path: "promotions",
      })
      .populate({
        path: "categories",
      });

    res.status(200).json(products);
  } catch (error) {
    new BadRequestError("Product could not be created. Please try again.");
  }
};

export default getProductsBySellerLimitController;
