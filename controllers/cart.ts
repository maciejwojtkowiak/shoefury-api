import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../models/user';
import Product from '../models/product';
import { IProduct } from '../types/Product';

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const currentUser = await User.findOne({ _id: req.body.userId });
  const addedProduct = await Product.findOne({
    title: req.body.productTitle,
  }) as IProduct;

  const cartItem = currentUser!.cart.items.find(
    (item) => item.productId.toString() === addedProduct._id.toString()
  );

  if (cartItem) {
    cartItem.quantity++;
  }
  if (!cartItem) {
    const cartItems = currentUser!.cart.items;
    const updatedCart = [...cartItems, { productId: addedProduct._id, quantity: 1 }]
    currentUser!.cart.items = updatedCart;
  }

  await currentUser!.save();
  res.status(201).json({ message: 'success' });
};

export const getCart = async (req: Request, res: Response) => {
  const currentUser = await User.findOne({ _id: req.body.userId });
  const cart = await currentUser!.populate('cart.items.product');
  res.status(200).json({ cart: cart });
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  const currentUser = await User.findOne({_id: req.body.userId});
  const productIdToDelete = req.body.productId
  console.log("PRODUCTID", productIdToDelete)
  console.log('ITEMS', currentUser!.cart.items )
  const cartItem =  currentUser!.cart.items.find(product => product.toString() === productIdToDelete)
  console.log("CARTITEM", cartItem)
  if (cartItem!.quantity === 1) {
    currentUser!.cart.items.filter(product => product.productId.toString() !== productIdToDelete)
  }

  if (cartItem!.quantity < 1) {
    cartItem!.quantity -= 1
  }
  await currentUser!.save()
  const cart = currentUser!.cart

  res.status(200).json({cart})
}
