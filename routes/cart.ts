import express, { RequestHandler } from "express";
import { isAuth } from "../middleware/isAuth";
import { addToCart, deleteItemFromCart, getCart } from "../controllers/cart";
const router = express.Router();

router.post("/add", isAuth, addToCart as RequestHandler);
router.get("/get-cart", isAuth, getCart as RequestHandler);
router.post("/delete-item", isAuth, deleteItemFromCart as RequestHandler);

export default router;
