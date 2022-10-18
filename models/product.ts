import mongoose from "mongoose";
import { IProduct } from "../types/Product";
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
    rating: [
      {
        review: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { collection: "products", timestamps: true }
);

const Product = mongoose.model("Product", product);
export default Product;
