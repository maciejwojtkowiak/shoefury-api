import express from "express";
import { getOrderRaport, getProfile } from "../controllers/profile";
import { isAuth } from "../middleware/isAuth";

const router = express.Router();

router.get("/get-profile", isAuth, getProfile);
router.get("/get-order-raport/:orderId", isAuth, getOrderRaport);

export default router;
