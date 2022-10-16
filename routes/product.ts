import express from 'express';

import { addProduct, getProducts } from '../controllers/product';
import { isAuth } from '../middleware/isAuth';

const router = express.Router();

router.get('/get-products', getProducts);

router.post('/add-product', isAuth,  addProduct);

export default router;
