import mongoose, { Schema } from "mongoose";

import bcrypt from "bcrypt";
import { IUser, IUserMethods } from "../types/User/User";

const user = new Schema<IUser, {}, IUserMethods>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  orders: [
    {
      _id: false,
      order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    },
  ],
  cart: {
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
  reviewedProducts: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      rate: { type: Number, required: false },
    },
  ],
  password: {
    type: String,
  },
  profileImage: {
    type: String,
    required: false,
  },
});

user.method(
  "setPassword",
  function setPassword(password) {
    this.password = bcrypt.hash(password, 16);
  },
  { collection: "users" }
);

const User = mongoose.model<IUser>("User", user);
export default User;
