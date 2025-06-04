export const checkExtraIngredients = (
  product: any,
  dbProduct: any,
  key = "extraIngredients"
) => {
  const copyProduct = { ...product, totalPrice: 0 };
  if (!product[key]) return { success: true, totalPrice: 0 };

  const validIngredients = product[key].filter((pei: any) =>
    dbProduct[key].some(
      (ei: any) => ei.id === pei._id && ei.price === pei.price
    )
  );

  if (validIngredients.length === product[key].length) {
    copyProduct.totalPrice = validIngredients.reduce(
      (sum: any, ei: any) => sum + ei.price,
      0
    );
    return { success: true, totalPrice: copyProduct.totalPrice };
  }

  return { success: false, totalPrice: 0 };
};
