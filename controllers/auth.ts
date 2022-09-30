import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { CustomError } from "../types/Error";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const register = async (req: Request<{}, {}, RegisterData>, res: Response) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const user = new User();
  user.name = name;
  user.email = email;
  user.cart = []
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  const token = jwt.sign({ userId: user._id }, `${process.env.SECRET_KEY}`, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
  res.status(200).json({ message: "LOGGED IN SUCCESSFULLY", token: token });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const userWithGivenEmail = await User.findOne({ email: email });
    if (userWithGivenEmail) {
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
        res.status(200).json({ message: "LOGGED IN SUCCESSFULLY", token: token });
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

export const isAuth = async (req: Request, res: Response) => {
  const token = req.get("Authorization")?.split(" ")[1];
  if (token) {
    try {
      const decodedToken = jwt.verify(token, `${process.env.SECRET_KEY}`);
      console.log('token', decodedToken)
      if (decodedToken) res.status(200).json({ isAuth: true });
    } catch (error) {
      console.log("ERROR", error)
      res.status(401).json({ isAuth: false });
    }
  } else res.status(401).json({ isAuth: false });
};
