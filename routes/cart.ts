import express, { RequestHandler } from "express";
import { isAuth } from "../middleware/isAuth";
import { addToCart, deleteItemFromCart, getCart } from "../controllers/cart";
const router = express.Router();

router.post("/add", isAuth as RequestHandler, addToCart as RequestHandler);
router.get("/get-cart", isAuth as RequestHandler, getCart as RequestHandler);
router.post(
  "/delete-item",
  isAuth as RequestHandler,
  deleteItemFromCart as RequestHandler
);

export default router;
