import mongoose, { Schema } from "mongoose";

export interface IOrder {
   totalPrice: number;
}

const order = new Schema<IOrder>({
   totalPrice: {
    type: Number,
    required: true,
   }
},  {collection: "orders", timestamps: true})

const Order = mongoose.model("Order", order)
export default Order
