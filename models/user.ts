import mongoose, { Model, ObjectId, Schema } from "mongoose";

import bcrypt from "bcrypt";

interface Item {
  product: ObjectId;
  quantity: number;
}

interface ICart {
  items: Item[];
}

interface IOrderItem {
  order: ObjectId;
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

type UserModel = Model<IUser, {}, IUserMethods>;

const user = new Schema<IUser, UserModel, IUserMethods>({
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
      order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    },
  ],
  cart: {
    items: [
      {
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

const User = mongoose.model<IUser, UserModel>("User", user);
export default User;
