import { Document, Schema } from "mongoose";
import { Product } from "../../models/product";
import { checkProductModifierGroup } from "./checkOrderProductModifierGroup";
import { checkExtraIngredients } from "./checkExtraIngredient";
import { checkIngredients } from "./checkIngredient";

const handleCheckOrderProducts = async (products: any) => {
  try {
    let orderTotalPrice = 0;
    const productIds = products.map((p: any) => p._id);

    const existProducts = await Product.find({
      _id: { $in: productIds },
    }).populate([
      { path: "ingredients extraIngredients" },
      {
        path: "modifierGroups",
        populate: {
          path: "modifierProducts.productId",
          model: "TestProduct",
          populate: [
            { path: "ingredients extraIngredients" },
            {
              path: "modifierGroups",
              populate: {
                path: "modifierProducts.productId",
                model: "TestProduct",
                populate: [
                  { path: "ingredients extraIngredients" },
                  {
                    path: "modifierGroups",
                    populate: {
                      path: "modifierProducts.productId",
                      model: "TestProduct",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);

    for (const product of products) {
      let copyProduct = { ...product, totalPrice: product.sellingPrice };
      const databaseProduct = existProducts.find(
        (p) => p._id.toString() === product._id.toString()
      );

      if (!databaseProduct) {
        throw new Error(`Product not found: ${product._id}`);
      }

      const modifierGroupPrice = checkProductModifierGroup(
        copyProduct,
        databaseProduct
      );
      const extraIngredientsPrice = checkExtraIngredients(
        copyProduct,
        databaseProduct
      );
      copyProduct.totalPrice += modifierGroupPrice.totalPrice;
      copyProduct.totalPrice += extraIngredientsPrice.totalPrice;

      const ingredientsResult = checkIngredients(copyProduct, databaseProduct);
      if (!ingredientsResult.success) {
        return { success: false };
      }

      orderTotalPrice += copyProduct.totalPrice;
    }

    return { success: true, totalPrice: orderTotalPrice };
  } catch (error: any) {
    console.error("Error checking order products:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
};

export default handleCheckOrderProducts;
