import { Response, Request, NextFunction, response } from "express";
import Order from "../models/order";
import User from "../models/user";
import { IAuthUser } from "../types/User";
import { createError } from "../utils/createError";
import { getUser } from "../utils/user/getUser";
import PDFDocument from "pdfkit";
import fs from "fs";

export const getProfile = async (
  req: Request<{}, {}, IAuthUser>,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = await getUser(req.body.userId);
  const userOrders = await currentUser!.populate("orders.order", "totalPrice");

  if (currentUser) {
    res.status(200).json({
      name: currentUser.name,
      profileImage: currentUser.profileImage,
      orders: userOrders.orders,
    });
  }
  if (!currentUser) next(createError("No user found", 500));
};

export const getOrderRaport = async (
  req: Request<{}, {}, IAuthUser>,
  res: Response,
  next: NextFunction,
) => {
  const orderId = req.query.orderId;
  const order = await Order.findOne({ orderId: orderId });
  if (!order) {
    next(createError("Order does not exist"));
    return;
  }
  const orderUser = await User.findOne({ userId: order.userId });
  const requestUser = await User.findOne({ userId: req.body.userId });
  if (!orderUser) {
    next(createError("Order was not found for the specified user"));
    return;
  }
  if (!requestUser || orderUser._id.toString() != requestUser._id.toString()) {
    next(createError("You are not allowed to view this order"));
    return;
  }
  
  const pdfName = `order-raport-${order._id}.pdf`;
  const pdfDoc = new PDFDocument();
  pdfDoc.pipe(fs.createWriteStream(`./pdf/${pdfName}`))
  pdfDoc.pipe(res)
  pdfDoc.fontSize(12).text("This is a test PDF");
  pdfDoc.end();
 
};
