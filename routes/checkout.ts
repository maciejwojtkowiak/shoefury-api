import express, { RequestHandler } from "express";
import { createCheckout, successOrder } from "../controllers/checkout";
import { isAuth } from "../middleware/isAuth";

const router = express.Router();

router.post("/create-checkout", createCheckout as RequestHandler);
router.get(
  "/order-success",
  isAuth as RequestHandler,
  successOrder as RequestHandler
);

export default router;
