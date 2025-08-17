import mysql from "mysql2";
import dotenv from "dotenv";
import { Cart, Item, JoinedCart } from "./types";

dotenv.config();

const dbPassword = process.env.SQL_PW || "";
const dbUser = process.env.SQL_USER || "";

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
export const queryDeleteCartItem = (id: number) => {
  return pool.query<Cart[]>("delete from cart where itemId = ?", [id]);
};

export const queryGetItem = (id: number) => {
  return pool.query<Item[]>("select * from items where id = ?", [id]);
};

export const queryGetItems = () => {
  return pool.query("select * from items");
};

// Cart queries
export const queryGetCart = () => {
  return pool.query<Cart[]>("select * from cart");
};

export const queryGetCartTotal = () => {
  return pool.query<JoinedCart[]>(
    "select itemId, quantity, price from cart left join items on cart.itemId = items.id")
}

export const queryInsertCartItem = (id: number, quantity: number) => {
  return pool.query<Cart[]>(
    "insert into cart (itemId, quantity) values (?, ?)",
    [id, quantity]
  );
};

export const queryUpdateCartItem = (itemId: number, quantity: number) => {
  return pool.query<Cart[]>("update cart set quantity = ? where itemId = ?", [
    quantity,
    itemId,
  ]);
};
