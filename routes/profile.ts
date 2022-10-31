import express, { RequestHandler } from "express";
import {
  editProfile,
  getOrderRaport,
  getProfile,
} from "../controllers/profile";
import { isAuth } from "../middleware/isAuth";

const router = express.Router();

router.get(
  "/get-profile",
  isAuth as RequestHandler,
  getProfile as RequestHandler
);

router.get(
  "/get-order-raport/:orderId",
  isAuth as RequestHandler,
  getOrderRaport as unknown as RequestHandler
);

router.patch(
  "/edit-name",
  isAuth as RequestHandler,
  editProfile as RequestHandler
);

export default router;
