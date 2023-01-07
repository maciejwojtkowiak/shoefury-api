import { NextFunction, Request, Response } from "express";
import Product from "../models/product";
import { encodeBase64 } from "../utils/encodeBase64";
import { createError } from "../utils/createError";
import { getUser } from "../utils/user/getUser";
import { findProduct } from "../utils/product/getProduct";
import { IProduct } from "../types/Product/Product";
import { IAuthUser } from "../types/Auth/Auth";
import Comment from "models/comment";

interface IAddReview extends IAuthUser {
  rate: number;
  productId: string;
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
  req: Request<{ id: string }, {}, {}>,
  res: Response
): Promise<void> => {
  const productId = req.params.id;
  const foundProduct = await Product.findOne({ _id: productId });
  res
    .status(200)
    .json({ message: "Product found", error: false, product: foundProduct });
};

export const addReview = async (
  req: Request<{}, {}, IAddReview>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const review = req.body.rate;
  const productId = req.body.productId;
  const REVIEW_MIN = 1;
  const REVIEW_MAX = 5;
  if (review < REVIEW_MIN || review > REVIEW_MAX) {
    next(
      createError(
        `Review range must be between ${REVIEW_MIN} and ${REVIEW_MAX}`,
        400
      )
    );
  }
  const currentUser = await getUser(req.body.userId);
  if (currentUser === null) {
    createError("User does not exist", 404);
    return;
  }
  const reviewedProduct = await findProduct(productId);

  if (reviewedProduct === null) {
    createError("Product does not exist", 404);
    return;
  }

  currentUser.reviewedProducts = [
    ...currentUser.reviewedProducts,
    { product: reviewedProduct._id, rate: review },
  ];
  await currentUser.save();

  reviewedProduct.rating = {
    reviewers: [...reviewedProduct.rating.reviewers, currentUser._id],
    rates: [...reviewedProduct.rating.rates, review],
  };
  await reviewedProduct.save();

  res.status(201).json({ message: "Successfully reviewed" });
};

export const addComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("COMMENT");
  const commentContent = req.body.commentContent;
  const comment = new Comment({
    userId: req.body.userId,
    productId: req.body.productId,
    commentContent,
  });
  await comment.save();
  console.log(commentContent);
};
