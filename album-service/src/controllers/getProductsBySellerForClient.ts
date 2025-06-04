import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product";

export const getProductsBySellerForClientController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const products = await Product.find({
      seller: id,
      ownSellable: true,
    })
      .populate([
        { path: "ingredients", select: "name price" },
        { path: "extraIngredients", select: "name price" },
        {
          path: "modifierGroups",
          populate: {
            path: "modifierProducts.productId",
            model: "TestProduct",
            populate: [
              { path: "ingredients", select: "name price" },
              { path: "extraIngredients", select: "name price" },
              {
                path: "modifierGroups",
                populate: {
                  path: "modifierProducts.productId",
                  model: "TestProduct",
                  populate: [
                    { path: "ingredients", select: "name price" },
                    { path: "extraIngredients", select: "name price" },
                    {
                      path: "modifierGroups",
                      populate: {
                        path: "modifierProducts.productId",
                        model: "TestProduct",
                        select: "name price",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ])
      .lean();
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this seller" });
    }

    res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message:
        "An error occurred while fetching products. Please try again later.",
    });
  }
};

export default getProductsBySellerForClientController;
