import mongoose, { Schema, Types } from "mongoose";
import { Item } from "./user";

export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  totalPrice: number;
  items: Item[];
}

const order = new Schema<IOrder>(
  {
    totalPrice: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    items: [
      {
        _id: false,
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { collection: "orders", timestamps: true }
);

const Order = mongoose.model("Order", order);
export default Order;
