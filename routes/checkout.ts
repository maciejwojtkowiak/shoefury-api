import express from 'express';
import { createCheckout, successOrder } from '../controllers/checkout';

const router = express.Router();

router.post('/create-checkout', createCheckout);
router.get('/order-success', successOrder)

export default router;
