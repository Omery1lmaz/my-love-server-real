export const checkIngredients = (
  product: any,
  dbProduct: any,
  key = "ingredients"
) => {
  if (!product[key]) return { success: true };

  const isValid = product[key].every((pei: any) =>
    dbProduct[key].some(
      (ei: any) => ei.id === pei._id && ei.price === pei.price
    )
  );

  return { success: isValid };
};
