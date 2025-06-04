import { Order } from "../../models/order";
import { Promotion } from "../../models/Promotion";

const handleCheckOrderDiscount = async ({
  orderAmount,
  sellerId,
  discountId,
  userId,
}: {
  orderAmount: any;
  sellerId: any;
  discountId: any;
  userId: any;
}) => {
  try {
    const promotion = await Promotion.findOne({
      _id: discountId,
      seller: { $elemMatch: { $eq: sellerId } },
    });

    if (!promotion) return { success: false, message: "Discount not found." };

    const totalUsed = await Order.countDocuments({
      user: userId,
      promotion: promotion._id,
    });

    if (totalUsed >= promotion.maximumUsageRights) {
      return { success: false, message: "Maximum usage limit reached." };
    }

    const now = new Date();
    if (
      orderAmount < promotion.lowestPrice ||
      orderAmount > promotion.highestPrice ||
      now > new Date(promotion.expirationDate)
    ) {
      return {
        success: false,
        message: "Order amount not eligible or promotion expired.",
      };
    }

    const discountAmount = Math.min(promotion.price, orderAmount);
    if (discountAmount <= 0) {
      return { success: false, message: "Discount is not applicable." };
    }

    return {
      success: true,
      discountName: promotion.name,
      discountAmount,
      promotionId: promotion._id,
    };
  } catch (error) {
    console.error("Error checking discount:", error);
    return {
      success: false,
      message: "An error occurred while checking the discount.",
    };
  }
};

export default handleCheckOrderDiscount;
