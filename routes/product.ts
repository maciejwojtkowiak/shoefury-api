import express from 'express';
import { addProduct, getProducts } from '../controllers/product';

const router = express.Router();

router.get('/get-products', getProducts);

router.post('/add-product', addProduct);

export default router;
