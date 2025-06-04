import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotAuthorizedError } from "@heaven-nsoft/common";
import { Product } from "../models/product";
import { getRequestFileAndUpload } from "../../utils/google/googleCloudProductImage";
import { DecodedToken } from "../../../auth-service/src/types/decodedToken";
import jwt from "jsonwebtoken";
export const updateProductImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
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

    const product = await Product.findOne({ _id: id, seller: decodedToken.id });
    if (!product) {
      return next(new BadRequestError("Product not found"));
    }

    const imageUrl = await getRequestFileAndUpload(req);
    product.imageUrl = imageUrl;
    await product.save();
    res
      .status(200)
      .json({ message: "Product image updated successfully", imageUrl });
  } catch (error) {
    console.error(error);
    return next(
      new BadRequestError("Failed to update product image. Please try again.")
    );
  }
};

export default updateProductImageController;
