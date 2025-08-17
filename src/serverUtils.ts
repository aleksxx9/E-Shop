import { Request } from "express";
import { Cart } from "./types";
import * as query from "./queries";
import { itemPromotion, percentagePromotion } from "./promotions";

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
    const [cart] = await query.queryGetCartTotal();
    const cartItems: { [id: string]: number } = {};
    const itemsTotal: { [id: string]: number } = {};

    let cartTotal = 0;

    cart.forEach((item) => {
      cartItems[item.itemId] = item.quantity;
    });

    // Defines discounts
    const itemPromo = new itemPromotion(1);
    const percentagePromo = new percentagePromotion({
      price: 75,
      percentage: 10,
    });

    const discountedItems = cart.map((item) => {
      itemPromo.discount(item);
      percentagePromo.discount(item);

      return item;
    });

    discountedItems.forEach((item) => {
      const itemTotal = Number((item.price * item.quantity).toFixed(2));

      cartTotal += itemTotal;

      itemsTotal[item.itemId] = itemTotal;
    });

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
