import { DecodedToken } from "./../../../auth-service/src/types/decodedToken";
import { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@heaven-nsoft/common";
import { Product } from "../models/product";
import jwt from "jsonwebtoken";
export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next(new NotAuthorizedError());
      return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      next(new NotAuthorizedError());
      return;
    }
    const decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY!
    ) as DecodedToken;
    const product = await Product.findOne({
      _id: id,
      user: decodedToken.id,
    }).lean();
    if (!product) {
      return next(new NotFoundError());
    }
    Object.assign(product, req.body);
    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

export default updateProductController;
