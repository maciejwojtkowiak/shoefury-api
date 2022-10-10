import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import Product from '../models/product';
import { IProduct } from '../types/Product';
import { getUser } from '../utils/user/getUser';

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const currentUser = await getUser(req.body.userId);
  const addedProduct = await Product.findOne({
    title: req.body.productTitle,
  }) as IProduct;

  const cartItem = currentUser!.cart.items.find(
    (item) => item.product.toString() === addedProduct._id.toString()
  );

  if (cartItem) {
    cartItem.quantity++;
  }
  if (!cartItem) {
    const cartItems = currentUser!.cart.items;
    const updatedCart = [...cartItems, { product: addedProduct._id, quantity: 1 }]
    currentUser!.cart.items = updatedCart;
  }

  await currentUser!.save();
  res.status(201).json({ message: 'success' });
};

export const getCart = async (req: Request, res: Response) => {
  const currentUser = await getUser(req.body.userId); 
  const cart = await currentUser!.populate("cart.items.product");
  res.status(200).json({ cart: cart.cart });
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  const currentUser = await getUser(req.body.userId);
  const productIdToDelete = req.body.productId
  const cartItem =  currentUser!.cart.items.find(product => product.toString() === productIdToDelete)
  if (cartItem!.quantity === 1) {
    currentUser!.cart.items.filter(product => product.product.toString() !== productIdToDelete)
  }

  if (cartItem!.quantity < 1) {
    cartItem!.quantity -= 1
  }
  await currentUser!.save()
  const cart = currentUser!.cart

  res.status(200).json({cart})
}
