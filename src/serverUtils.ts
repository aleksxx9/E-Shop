import { Request } from "express";
import { Cart, Discounts } from "./types";
import * as query from "./queries";

const errorResponse = { status: 500, res: { Success: false } };
const successResponse = { status: 200, res: { Success: true } };

// Items requests
export const getItems = async () => {
  try {
    const [rows] = await query.queryGetItems();

    return { status: 200, res: rows };
  } catch (err: any) {
    console.log(err.message);

    return errorResponse;
  }
};

export const getItem = async (req: Request) => {
  try {
    const { itemId } = req.params;
    const id = Number(itemId);

    if (!id) {
      throw new Error("Wrong id");
    }
    const [item] = await query.queryGetItem(id);

    if (!item.length) {
      throw new Error("There's no item with such id");
    }

    return { status: 200, res: item };
  } catch (err: any) {
    console.log(err.message);

    return errorResponse;
  }
};

// Cart requests
export const getCart = async () => {
  try {
    const [cart] = await query.queryGetCart();

    return { status: 200, res: cart };
  } catch (err: any) {
    console.log(err.message);

    return errorResponse;
  }
};

export const getCartTotal = async () => {
  try {
    const [cart] = await query.queryGetCart();
    const [discounts] = await query.queryGetPromotions();
    const cartItems: { [key: string]: number } = {};
    const itemsTotal: { [id: string]: number } = {};
    const promotions: Discounts = { getFree: [], percentage: [] };
    let cartTotal = 0;

    // Organises discounts by type
    discounts.forEach((discount) => {
      if (discount.promotionType === "getFree" && discount.itemId) {
        promotions.getFree.push(discount.itemId);
      } else if (
        discount.promotionPercentage &&
        discount.promotionStartingPrice
      ) {
        promotions.percentage.push({
          percentage: discount.promotionPercentage,
          price: discount.promotionStartingPrice,
        });
      }
    });

    cart.forEach((item) => {
      cartItems[item.itemId] = item.quantity;
    });

    for await (const cartItem of Object.entries(cartItems)) {
      const [key, quantity] = cartItem;
      const [item] = await query.queryGetItem(Number(key));
      let bonusQuantity = quantity;

      if (!item[0]) {
        throw new Error("Invalid cart items");
      }
      const trueItem = item[0];

      // applying discounts
      if (promotions.getFree.includes(item[0].id)) {
        bonusQuantity = Math.ceil(bonusQuantity / 2);
      }

      if (promotions.percentage.length) {
        promotions.percentage.forEach((promotion) => {
          if (promotion.price <= trueItem.price) {
            trueItem.price = Number((trueItem.price / 2).toFixed(2));
          }
        });
      }

      // counting totals
      const itemTotal = (trueItem.price * bonusQuantity).toFixed(2);
      itemsTotal[trueItem.id] = Number(itemTotal);
      cartTotal += Number(itemTotal);
    }

    cartTotal = Number(cartTotal.toFixed(2));

    return {
      status: 200,
      res: { cartTotal, itemsTotal },
    };
  } catch (err: any) {
    console.log(err.message);

    return errorResponse;
  }
};

export const deleteItemFromCart = async (req: Request) => {
  try {
    const { itemId } = req.params;
    const id = Number(itemId);

    if (!id) {
      throw new Error("Missing data");
    }

    await query.queryDeleteCartItem(id);

    return successResponse;
  } catch (err: any) {
    console.log(err.message);

    return errorResponse;
  }
};

export const addItemsToCart = async (req: Request) => {
  try {
    const { itemId, quantity } = req.params;
    const id = Number(itemId);
    const qty = Number(quantity);

    if (!id || !qty) {
      throw new Error("Missing data");
    }

    const [cart] = await query.queryGetCart();

    if (cart.length) {
      const updateItem: Cart[] = cart.filter((item) => item.itemId === id);

      if (updateItem[0]) {
        const item: Cart = updateItem[0];
        item.quantity += qty;

        if (item.quantity > 0) {
          await query.queryUpdateCartItem(item.itemId, item.quantity);
        } else {
          await query.queryDeleteCartItem(item.itemId);
        }
      } else if (qty > 0) {
        await query.queryInsertCartItem(id, qty);
      } else {
        throw new Error("Incorrect data");
      }
    } else {
      await query.queryInsertCartItem(id, qty);
    }

    return successResponse;
  } catch (err: any) {
    console.log(err.message);

    return errorResponse;
  }
};

// Discount requests
export const getPromotions = async () => {
  try {
    const [promotions] = await query.queryGetPromotions();

    return { status: 200, res: { promotions } };
  } catch (err: any) {
    console.log(err.message);

    return errorResponse;
  }
};

export const addDiscount = async (req: Request) => {
  try {
    const { type, itemId, discountPrice, discountPercentage } = req.params;
    const id = Number(itemId);
    const price = Number(discountPrice);
    const percentage = Number(discountPercentage);

    if (type === "getFree" && !id) {
      throw new Error("Wrong data");
    }

    if (type === "percentage" && (!price || !percentage)) {
      throw new Error("Wrong data");
    }

    if (type === "getFree") {
      await query.queryAddFreeDiscount(type, id);
    } else if (type === "percentage") {
      await query.queryAddPercentageDiscount(type, price, percentage);
    }
    return errorResponse;
  } catch (err: any) {
    console.log(err.message);

    return errorResponse;
  }
};
export const addPercentageDiscount = async (req: Request) => {
  try {
    const { discountPrice, discountPercentage } = req.params;
    const price = Number(discountPrice);
    const percentage = Number(discountPercentage);

    if (!price || !percentage) {
      throw new Error("Wrong data");
    }

    await query.queryAddPercentageDiscount("percentage", price, percentage);

    return successResponse;
  } catch (err: any) {
    console.log(err.message);

    return errorResponse;
  }
};

export const addItemDiscount = async (req: Request) => {
  try {
    const { itemId } = req.params;
    const id = Number(itemId);

    if (!id) {
      throw new Error("Wrong data");
    }

    await query.queryAddFreeDiscount("getFree", id);

    return successResponse;
  } catch (err: any) {
    console.log(err.message);

    return errorResponse;
  }
};

export const deleteDiscount = async (req: Request) => {
  try {
    const { promotionId } = req.params;
    const id = Number(promotionId);

    if (!id) {
      throw new Error("Wrong data");
    }

    await query.queryDeletePromotion(id);

    return successResponse;
  } catch (err: any) {
    console.log(err.message);

    return errorResponse;
  }
};
