import express from 'express';
import { isAuth } from '../middleware/isAuth';
import { addToCart, deleteItemFromCart, getCart } from '../controllers/cart';
const router = express.Router();

router.post('/add', isAuth, addToCart);
router.get('/get-cart', isAuth,  getCart);
router.delete('/delete-item', isAuth, deleteItemFromCart)

export default router;
