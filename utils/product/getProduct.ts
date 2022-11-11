import Product from "../../models/product";
import { IProduct } from "../../types/Product/Product";

export const findProduct = async (id: string): Promise<IProduct | null> => {
  const product = await Product.findOne({ _id: id });
  return product;
};
