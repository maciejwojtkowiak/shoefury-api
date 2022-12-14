import express, { RequestHandler } from "express";

import {
  addProduct,
  addReview,
  getProduct,
  getProducts,
} from "../controllers/product";
import { isAuth } from "../middleware/isAuth";

const router = express.Router();

router.get("/get-products", getProducts as RequestHandler);

router.get("/get-product/:id", getProduct as unknown as RequestHandler);

router.post(
  "/add-product",
  isAuth as RequestHandler,
  addProduct as RequestHandler
);

router.post(
  "/add-review",
  isAuth as RequestHandler,
  addReview as RequestHandler
);

export default router;
