import { Request, Response } from 'express';
import Product from '../models/product';
import { encodeBase64 } from '../utils/encodeBase64';

interface IProduct {
  title: string;
  price: string;
  imageData: string;
}

export const addProduct = async (req: Request<{}, {}, IProduct>, res: Response) => {
  const title = req.body.title;
  const price = req.body.price;
  const image = req.file ? encodeBase64(req.file.path) : ""
  console.log('IMAGE', image)
  const product = new Product({
    title: title,
    price: price,
    imageData: image,
  });

  await product.save();
  res.status(201).json({ message: 'added successfully' });
};

export const getProducts = async (req: Request, res: Response) => {
  const LIMIT_PER_PAGE = 9;
  const currentPage = req.query.page || 1;
  try {
    const productCount = await Product.countDocuments();
    const pagesCount = Math.ceil(productCount / LIMIT_PER_PAGE);
    const products = await Product.find()
      .skip((+currentPage - 1) * LIMIT_PER_PAGE)
      .limit(LIMIT_PER_PAGE);

    res.status(200).json({
      message: 'Get products successfully',
      products: products,
      pagesCount: pagesCount,
      totalProducts: productCount,
    });
  } catch (e) {
    res.status(500).json({ message: 'Products can not be fetched, try again later' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const productTitle = req.body.title;
  const foundProduct = await Product.find({ title: productTitle });
  res.status(200).json({ message: 'Product found', foundProduct: foundProduct });

};
