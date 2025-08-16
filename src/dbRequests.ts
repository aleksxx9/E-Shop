import mysql from "mysql2";
import dotenv from "dotenv";
import { Request } from "express";
import { Cart, Item } from "./types";

dotenv.config();
const dbPassword = process.env.SQL_PW || "";
const dbUser = process.env.SQL_USER || "";
const errorResponse = { status: 500, res: { Success: false } };

// Creates database pool connection
const pool = mysql
  .createPool({
    host: "localhost",
    user: dbUser,
    password: dbPassword,
    database: "eShop",
  })
  .promise();

// Items queries
const queryDeleteCartItem = (id: number) => {
  return pool.query<Cart[]>("delete from cart where itemId = ?", [id]);
};

const queryGetItem = (id: number) => {
  return pool.query<Item[]>("select * from items where id = ?", [id]);
};

// Cart queries
const queryGetCart = () => {
  return pool.query<Cart[]>("select * from cart");
};

const queryInsertCartItem = (id: number, quantity: number) => {
  return pool.query<Cart[]>(
    "insert into cart (itemId, quantity) values (?, ?)",
    [id, quantity]
  );
};

const queryUpdateCartItem = (itemId: number, quantity: number) => {
  return pool.query<Cart[]>("update cart set quantity = ? where itemId = ?", [
    quantity,
    itemId,
  ]);
};

// Items requests
export const getItems = async () => {
  try {
    const [rows] = await pool.query("select * from items");

    return { status: 200, res: rows };
  } catch (err) {
    console.log(err);

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
    const [item] = await queryGetItem(id);

    if (!item.length) {
      throw new Error("There's no item with such id");
    }

    return { status: 200, res: item };
  } catch (err) {
    console.log(err);

    return errorResponse;
  }
};

// Cart requests
export const getCart = async () => {
  try {
    const [cart] = await queryGetCart();

    return { status: 200, res: cart };
  } catch (err) {
    console.log(err);

    return errorResponse;
  }
};

export const getCartTotal = async () => {
  try {
    const [cart] = await queryGetCart();
    const cartItems: { [key: string]: number } = {};
    const itemsTotal: { [id: string]: number } = {};
    let cartTotal = 0;

    cart.forEach((item) => {
      cartItems[item.itemId] = item.quantity;
    });

    for await (const cartItem of Object.entries(cartItems)) {
      const [key, value] = cartItem;
      const [item] = await queryGetItem(Number(key));

      if (!item[0]) {
        throw new Error("Invalid cart items");
      }

      const itemTotal = (item[0].price * value).toFixed(2);
      itemsTotal[item[0].id] = Number(itemTotal);
      cartTotal += Number(itemTotal);
    }

    return { status: 200, res: { cartTotal, itemsTotal } };
  } catch (err) {
    console.log(err);

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

    await queryDeleteCartItem(id);

    return { status: 200, res: { Success: true } };
  } catch (err) {
    console.log(err);

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

    const [cart] = await pool.query<Cart[]>("select * from cart");

    if (cart.length) {
      const updateItem: Cart[] = cart.filter((item) => item.itemId === id);

      if (updateItem[0]) {
        const item: Cart = updateItem[0];
        item.quantity += qty;

        if (item.quantity > 0) {
          await queryUpdateCartItem(item.itemId, item.quantity);
        } else {
          await queryDeleteCartItem(item.itemId);
        }
      } else if (qty > 0) {
        await queryInsertCartItem(id, qty);
      } else {
        throw new Error("Incorrect data");
      }
    } else {
      await queryInsertCartItem(id, qty);
    }

    return { status: 200, res: { Success: true } };
  } catch (err) {
    console.log(err);

    return errorResponse;
  }
};
