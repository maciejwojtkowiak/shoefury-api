import express from 'express';
import { isAuth } from '../middleware/isAuth';
import { addToCart, getCart } from '../controllers/cart';
const router = express.Router();

router.post('/add', isAuth, addToCart);
router.get('/get-cart', isAuth,  getCart);

export default router;
