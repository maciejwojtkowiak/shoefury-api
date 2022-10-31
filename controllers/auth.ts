import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CustomError } from "../types/Error/Error";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const register = async (
  req: Request<{}, {}, RegisterData>,
  res: Response
): Promise<void> => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const user = new User();
  user.name = name;
  user.email = email;
  user.cart.items = [];
  user.orders = [];
  user.reviewedProducts = [];
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  const token = jwt.sign({ userId: user._id }, `${process.env.SECRET_KEY}`, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
  res.status(200).json({ message: "LOGGED IN SUCCESSFULLY", token });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const userWithGivenEmail = await User.findOne({ email });
    if (userWithGivenEmail != null) {
      const isPasswordCorrect = password === userWithGivenEmail.password;
      if (isPasswordCorrect) {
        const token = jwt.sign(
          { userId: userWithGivenEmail._id },
          `${process.env.SECRET_KEY}`,
          {
            algorithm: "HS256",
            expiresIn: "1h",
          }
        );
        res.status(200).json({ message: "LOGGED IN SUCCESSFULLY", token });
      }
      if (!isPasswordCorrect) {
        const error = new Error("Wrong password") as CustomError;
        error.status = 401;
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.get("Authorization")?.split(" ")[1];
  if (token !== undefined) {
    try {
      const decodedToken = jwt.verify(token, `${process.env.SECRET_KEY}`);
      if (decodedToken === null) return;
      res.status(200).json({ isAuth: true });
    } catch (error) {
      const err = new Error("Not auth") as CustomError;
      err.status = 401;
      next(err);
    }
  } else next(new Error("Not authenticated") as CustomError);
};
