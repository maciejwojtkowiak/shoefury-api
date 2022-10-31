import { Types } from "mongoose";
import { ICartItem } from "types/Cart/Cart";

export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  totalPrice: number;
  items: ICartItem[];
}

export interface IOrderItem {
  order: Types.ObjectId;
}
