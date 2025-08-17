import { RowDataPacket } from "mysql2";

export interface Cart extends RowDataPacket {
  id: number;
  itemId: number;
  quantity: number;
}

export interface Item extends RowDataPacket {
  id: number;
  itemId: number;
  price: number;
}

export interface Promotion extends RowDataPacket {
  id: number;
  itemId?: number;
  promotionType?: string;
  promotionPercentage?: number;
  promotionPrice?: number;
}

export interface JoinedCart extends RowDataPacket {
  itemId: number;
  price: number;
  quantity: number;
}

export interface DiscountParams {
  price: number;
  percentage: number;
}
