import { Response, Request } from 'express';
import { ObjectId } from 'mongoose';
import Stripe from 'stripe';
import { frontendDomain } from '../config/config';
import { FrontendPaths } from '../config/FrontendPaths';
import Order from '../models/order';
import User, { IUser } from '../models/user';

import { IProduct } from '../types/Product';
import { stripeInstance } from '../utils/stripe';
interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICart {
  items: ICartItem[];
}

interface ICheckoutRequestBody {
  items: ICartItem[];
}

export const createCheckout = async (
  req: Request<{}, {}, ICheckoutRequestBody>,
  res: Response
) => {
  const productsArr: any = [];
  const products = req.body.items;
  products.forEach((product) =>
    productsArr.push({
      price_data: {
        currency: 'usd',
        unit_amount: +product.product.price * 100,
        product_data: {
          name: product.product.title,
          description: product.product.title,
        },
      },
      quantity: product.quantity,
    })
  );

  const session = await stripeInstance.checkout.sessions.create({
    line_items: productsArr,
    mode: 'payment',
    success_url: `${frontendDomain}/${FrontendPaths.successOrder}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendDomain}`,
  });

  res.status(200).json({ url: session.url });
};


export const successOrder = async (req: Request, res: Response) => {
  console.log(req.query.session_id, "PARAMS")
  const session = await stripeInstance.checkout.sessions.retrieve(req.query.session_id as string)
  const totalPrice = session.amount_total;

  const order = new Order({totalPrice})
  const currentUser = await User.findOne({ _id: req.body.userId });
  currentUser!.orders.push(order);
  currentUser!.save();
  order.save();
  res.status(200).json({totalPrice: totalPrice})
}
