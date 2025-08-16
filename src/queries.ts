import mysql from "mysql2";
import dotenv from "dotenv";
import { Cart, Item, Promotion } from "./types";

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

// Discount queries

export const queryGetPromotions = () => {
  return pool.query<Promotion[]>("select * from promotions");
};

export const queryDeletePromotion = (id: number) => {
  return pool.query<Promotion[]>("delete from promotions where id = ?", [id]);
};

export const queryAddFreeDiscount = (type: string, itemId: number) => {
  return pool.query<Promotion[]>(
    "insert into promotions (promotionType, itemId) values (?, ?)",
    [type, itemId]
  );
};

export const queryAddPercentageDiscount = (
  type: string,
  price: number,
  percentage: number
) => {
  return pool.query<Promotion[]>(
    "insert into promotions (promotionType, promotionPercentage, promotionStartingPrice) values (?, ?, ?)",
    [type, percentage, price]
  );
};
