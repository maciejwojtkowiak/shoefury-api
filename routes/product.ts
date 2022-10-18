import express, { RequestHandler } from "express";

import { addProduct, getProducts } from "../controllers/product";
import { isAuth } from "../middleware/isAuth";

const router = express.Router();

router.get("/get-products", getProducts as RequestHandler);

router.post("/add-product", isAuth, addProduct as RequestHandler);

export default router;
