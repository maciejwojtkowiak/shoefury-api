import { NextFunction, Request, Response } from "express";
import Product from "../models/product";
import { encodeBase64 } from "../utils/encodeBase64";
import { createError } from "../utils/createError";

interface IProduct {
  description: string;
  title: string;
  price: string;
  imageData: string;
}

export const addProduct = async (
  req: Request<{}, {}, IProduct>,
  res: Response
): Promise<void> => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageData = req.file != null ? encodeBase64(req.file.path) : "";

  const product = new Product({
    description,
    title,
    price,
    imageData,
  });

  await product.save();
  res.status(201).json({ message: "added successfully" });
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const LIMIT_PER_PAGE = 9;
  const currentPage = req.query.page ?? 1;
  try {
    const totalProducts = await Product.countDocuments();
    const pagesCount = Math.ceil(totalProducts / LIMIT_PER_PAGE);
    const products = await Product.find()
      .skip((+currentPage - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE);

    res.status(200).json({
      message: "Get products successfully",
      products,
      pagesCount,
      totalProducts,
    });
  } catch (error) {
    const getError = createError(
      "Products can no be fetched, try again later",
      500
    );
    next(getError);
  }
};

export const getProduct = async (
  req: Request<{}, {}, { title: string }>,
  res: Response
): Promise<void> => {
  const productTitle = req.body.title;
  const foundProduct = await Product.find({ title: productTitle });
  res.status(200).json({ message: "Product found", foundProduct });
};
