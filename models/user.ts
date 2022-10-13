import mongoose, { Types, Schema } from "mongoose";

import bcrypt from "bcrypt";

interface Item {
  product: Types.ObjectId;
  quantity: number;
}

interface ICart {
  items: Item[];
}

interface IOrderItem {
  order: Types.ObjectId;
}
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  orders: IOrderItem[];
  cart: ICart;
  profileImage: string;
}

interface IUserMethods {
  setPassword(password: string): void;
  decryptPasswordSuccess(password: string): void;
}

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
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },

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
  { collection: "users" },
);

const User = mongoose.model<IUser>("User", user);
export default User;
