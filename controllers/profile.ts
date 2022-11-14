import { Response, Request, NextFunction } from "express";
import Order from "../models/order";
import User from "../models/user";

import { createError } from "../utils/createError";
import { getUser } from "../utils/user/getUser";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

import { IAuthUser } from "types/Auth/Auth";
import { IProduct } from "types/Product/Product";
import { IProfileEdit } from "types/Profile/Profile";

interface IOrderIdParam {
  orderId: string;
}

export const getProfile = async (
  req: Request<{}, {}, IAuthUser>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const currentUser = await getUser(req.body.userId);
  if (currentUser != null) {
    const userOrders = await currentUser.populate("orders.order", "totalPrice");
    res.status(200).json({
      name: currentUser.name,
      profileImage: currentUser.profileImage,
      orders: userOrders.orders,
    });
  }
  if (currentUser == null) next(createError("No user found", 500));
};

export const getOrderRaport = async (
  req: Request<IOrderIdParam, {}, IAuthUser>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({ orderId });
  if (order === null) {
    next(createError("Order does not exist", 400));
    return;
  }
  const orderUser = await User.findOne({ userId: order.userId });
  const requestUser = await User.findOne({ userId: req.body.userId });
  if (orderUser == null) {
    next(createError("Order was not found for the specified user", 400));
    return;
  }
  if (
    requestUser == null ||
    orderUser._id.toString() !== requestUser._id.toString()
  ) {
    next(createError("You are not allowed to view this order", 400));
    return;
  }

  const pdfName = `cv123${orderId}.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${pdfName}`);
  const products = await order.populate("items.product");
  const pdfPath = path.join("data", pdfName);
  const pdfStream = fs.createWriteStream(pdfPath);
  const pdfDoc = new PDFDocument();
  const writeStream = pdfDoc.pipe(pdfStream);
  pdfDoc.fontSize(25).text(`Order ${orderId}`);
  pdfDoc.lineGap(50);
  pdfDoc.fontSize(13).text(`${orderUser.name}`);
  products.items.forEach((p) => {
    const product = p.product as unknown as IProduct;
    pdfDoc
      .fontSize(14)
      .text(`${product.title} ${p.quantity}x ${+product.price * p.quantity}`, {
        wordSpacing: 50,
      });
  });
  pdfDoc
    .image("images/logo.png", 30, 15, { scale: 0.7 })
    .font("Times-Italic")
    .fontSize(25)
    .text("Shoefury", 70, 25);
  pdfDoc.end();
  writeStream.on("finish", () => {
    const fileStream = fs.createReadStream(pdfPath, { encoding: "base64" });
    fileStream.on("data", (chunk: Buffer) => {
      res.write(chunk);
    });
    fileStream.on("end", () => {
      fs.unlink(pdfPath, () => {
        res.end();
      });
    });
  });
};

export const editProfile = async (
  req: Request<{}, {}, IProfileEdit>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const currentUser = await getUser(req.body.userId);
  if (currentUser === null) {
    next(createError("No user in request", 400));
    return;
  }
  const name = req.body.name;
  currentUser.name = name;
  await currentUser?.save();
  res.status(200).json({ message: "success" });
};
