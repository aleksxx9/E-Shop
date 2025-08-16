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
