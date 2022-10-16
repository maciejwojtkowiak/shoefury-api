import { Types } from "mongoose";

export interface IProduct {
  _id: Types.ObjectId;
  description: string;
  title: string;
  price: string;
  imageData: string;
}
