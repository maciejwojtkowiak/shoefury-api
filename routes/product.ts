import express from 'express';
import { isAuth } from '../controllers/auth';
import { addProduct, getProducts } from '../controllers/product';

const router = express.Router();

router.get('/get-products', getProducts);

router.post('/add-product', isAuth,  addProduct);

export default router;
