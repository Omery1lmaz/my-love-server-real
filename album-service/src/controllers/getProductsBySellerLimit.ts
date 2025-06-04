import { DecodedToken } from "./../../../auth-service/src/types/decodedToken";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@heaven-nsoft/common";
import { Product } from "../models/product";
import jwt from "jsonwebtoken";
import { decode } from "punycode";
export const getProductsBySellerLimitController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { limit, skip } = req.params;
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "Lütfen giriş yapın" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(400).json({ message: "Token bulunamadı" });
      return;
    }

    const decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY!
    ) as DecodedToken;
    const products = await Product.find({ user: decodedToken.id })
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ date: -1 })
      .populate({ path: "categories", select: "name" })
      .populate({ path: "user", select: "name" });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

export default getProductsBySellerLimitController;
