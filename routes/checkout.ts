import express from 'express';
import { createCheckout } from '../controllers/checkout';

const router = express.Router();

router.post('/create-checkout', createCheckout);

export default router;
