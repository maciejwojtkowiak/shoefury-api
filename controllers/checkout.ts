import { Response, Request } from 'express';
import { ObjectId } from 'mongoose';

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
  console.log(products);
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
    success_url: 'http://localhost:3000',
    cancel_url: 'http://localhost:3000',
  });

  res.json({ url: session.url });
};
