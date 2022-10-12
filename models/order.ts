import mongoose, { ObjectId, Schema } from "mongoose";

export interface IOrder {
  _id: ObjectId;
  totalPrice: number;
}

const order = new Schema<IOrder>(
  {
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { collection: "orders", timestamps: true },
);

const Order = mongoose.model("Order", order);
export default Order;
