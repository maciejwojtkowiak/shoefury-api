import mongoose, { Schema } from "mongoose";

const order = new Schema({
   totalPrice: {
    type: Number,
    required: true,
   }
},  {collection: "orders", timestamps: true})

const Order = mongoose.model("Order", order)
export default Order
