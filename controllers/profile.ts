import { Response, Request, NextFunction } from "express";
import Order from "../models/order";
import User from "../models/user";
import { IAuthUser } from "../types/User";
import { createError } from "../utils/createError";
import { getUser } from "../utils/user/getUser";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { IProduct } from "../types/Product";

export const getProfile = async (
  req: Request<{}, {}, IAuthUser>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const currentUser = await getUser(req.body.userId);
  console.log("USERID", req.body.userId);
  console.log("CURRENT USER", currentUser);
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
  req: Request<{ orderId: string }, {}, IAuthUser>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({ orderId: "634c361e6f30118f1228307a" });
  console.log("ORDERID", orderId);
  console.log("ACUTAL ORDERID", order);
  if (order === null) {
    next(createError("Order does not exist"));
    return;
  }
  const orderUser = await User.findOne({ userId: order.userId });
  const requestUser = await User.findOne({ userId: req.body.userId });
  if (orderUser == null) {
    next(createError("Order was not found for the specified user"));
    return;
  }
  if (
    requestUser == null ||
    orderUser._id.toString() !== requestUser._id.toString()
  ) {
    next(createError("You are not allowed to view this order"));
    return;
  }

  const pdfName = `cv123${orderId}.pdf`;
  res.setHeader("Content-Type", "text/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${pdfName}`);
  const products = await order.populate("items.product");
  const pdfPath = path.join("data", pdfName);
  const pdfStream = fs.createWriteStream(pdfPath);
  const pdfDoc = new PDFDocument();
  const writeStream = pdfDoc.pipe(pdfStream);
  pdfDoc.fontSize(25).text(`Order ${orderId}`);
  pdfDoc.fontSize(13).text(`User ${orderUser.name}`);
  console.log("PRODUCTS", products);
  products.items.forEach((p) => {
    pdfDoc.fontSize(14).text((p.product as unknown as IProduct).title);
  });

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
