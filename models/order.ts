import mongoose, { Schema, Types } from "mongoose";

export interface IOrder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  totalPrice: number;
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
  },
  { collection: "orders", timestamps: true },
);

const Order = mongoose.model("Order", order);
export default Order;
