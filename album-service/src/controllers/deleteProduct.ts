import { DecodedToken } from "./../../../auth-service/src/types/decodedToken";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotAuthorizedError } from "@heaven-nsoft/common";
import { Product } from "../models/product";
import jwt from "jsonwebtoken";
import { decode } from "punycode";
export const deleteProductController = async (
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
    const products = await Product.findOneAndDelete({
      _id: id,
      seller: decodedToken.id,
    });
    res.status(200).json(products);
  } catch (error) {
    next(new BadRequestError("Failed to delete product"));
  }
};

export default deleteProductController;
