import { Response, Request } from "express";

import { frontendDomain } from "../config/config";
import { FrontendPaths } from "../config/FrontendPaths";
import Order from "../models/order";
import User from "../models/user";

import { IProduct } from "../types/Product";
import { IAuthUser } from "../types/User";
import { stripeInstance } from "../utils/stripe";
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
  res: Response,
) => {
  const productsArr: any = [];
  const products = req.body.items;
  products.forEach((product) =>
    productsArr.push({
      price_data: {
        currency: "usd",
        unit_amount: +product.product.price * 100,
        product_data: {
          name: product.product.title,
          description: product.product.title,
        },
      },
      quantity: product.quantity,
    }),
  );

  const session = await stripeInstance.checkout.sessions.create({
    line_items: productsArr,
    mode: "payment",
    success_url: `${frontendDomain}/${FrontendPaths.successOrder}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendDomain}`,
  });

  res.status(200).json({ url: session.url });
};

export const successOrder = async (req: Request<{}, {}, IAuthUser>, res: Response) => {
  const session = await stripeInstance.checkout.sessions.retrieve(
    req.query.session_id as string,
  );
  const totalPrice = session.amount_total;

  const order = new Order({ totalPrice });
  await order.save();
  const currentUser = await User.findOne({ _id: req.body.userId });
  currentUser!.orders = [...currentUser!.orders, { order: order._id }];
  await order.save();
  await currentUser!.save();
  res.status(200).json({ totalPrice: totalPrice });
};
