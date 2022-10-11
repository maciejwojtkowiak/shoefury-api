import express from "express";
import { getProfile } from "../controllers/profile";
import { isAuth } from "../middleware/isAuth";

const router = express.Router();

router.get("/get-profile", isAuth, getProfile)

export default router