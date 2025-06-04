import { checkExtraIngredients } from "./checkExtraIngredient";
import { checkIngredients } from "./checkIngredient";

export const checkProductModifierGroup = (
  product: any,
  databaseProduct: any
) => {
  const copyProduct = { ...product, totalPrice: 0 };
  if (!databaseProduct.modifierGroups) return { success: false, totalPrice: 0 };

  for (const modifierGroup of databaseProduct.modifierGroups) {
    const existModifierGroup = copyProduct.modifierGroups?.find(
      (pModifierGroup: any) => pModifierGroup.id === modifierGroup.id
    );

    if (!existModifierGroup) return { success: false, totalPrice: 0 };

    if (
      existModifierGroup.modifierProducts.length < modifierGroup.min ||
      existModifierGroup.modifierProducts.length > modifierGroup.max
    ) {
      return { success: false, totalPrice: 0 };
    }

    for (const selectedProduct of existModifierGroup.modifierProducts) {
      copyProduct.totalPrice += selectedProduct.extraPrice;
      const existModifierProduct = modifierGroup.modifierProducts.find(
        (modifierProduct: any) =>
          modifierProduct.extraPrice === selectedProduct.extraPrice &&
          modifierProduct.productId._id.toString() ===
            selectedProduct.productId._id
      );

      if (!existModifierProduct) return { success: false, totalPrice: 0 };

      const extraIngredientPrice = checkExtraIngredients(
        selectedProduct,
        existModifierProduct
      );
      checkIngredients(selectedProduct, existModifierProduct);
      const extraModifierPrice = checkProductModifierGroup(
        selectedProduct.productId,
        existModifierProduct.productId
      );

      copyProduct.totalPrice += extraIngredientPrice.totalPrice;
      copyProduct.totalPrice += extraModifierPrice.totalPrice;
    }
  }

  return { success: true, totalPrice: copyProduct.totalPrice };
};
