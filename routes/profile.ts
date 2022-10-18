import express, { RequestHandler } from "express";
import { getOrderRaport, getProfile } from "../controllers/profile";
import { isAuth } from "../middleware/isAuth";

const router = express.Router();

router.get("/get-profile", isAuth, getProfile as RequestHandler);
router.get(
  "/get-order-raport/:orderId",
  isAuth,
  getOrderRaport as unknown as RequestHandler
);

export default router;
