import express from 'express';
import { createCheckout, successOrder } from '../controllers/checkout';
import { isAuth } from '../middleware/isAuth';

const router = express.Router();

router.post('/create-checkout', createCheckout);
router.get('/order-success', isAuth ,successOrder)

export default router;
