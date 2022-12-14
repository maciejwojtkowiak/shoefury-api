import mongoose from "mongoose";
import { IProduct } from "../types/Product/Product";
const { Schema } = mongoose;

const product = new Schema<IProduct>(
  {
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    imageData: {
      type: String,
      required: true,
    },
    rating: {
      reviewers: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      rates: [
        {
          type: String,
          required: false,
        },
      ],
    },
  },
  { collection: "products", timestamps: true }
);

const Product = mongoose.model("Product", product);
export default Product;
