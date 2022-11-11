import mongoose, { Types } from "mongoose";
import { ICart } from "../Cart/Cart";
import { IOrderItem } from "../Order/Order";

interface IUserReview {
  product: Types.ObjectId;
  rate: number;
}

export interface IUserMethods {
  setPassword: (password: string) => void;
  decryptPasswordSuccess: (password: string) => void;
}

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  orders: IOrderItem[];
  cart: ICart;
  reviewedProducts: IUserReview[];
  profileImage: string;
}
