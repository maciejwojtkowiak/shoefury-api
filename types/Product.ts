import mongoose, { Types } from "mongoose";

interface IRating {
  reviewers: Types.ObjectId[];
  rates: number[];
}

export interface IProduct extends mongoose.Document {
  _id: Types.ObjectId;
  description: string;
  title: string;
  price: string;
  imageData: string;
  rating: IRating;
}
