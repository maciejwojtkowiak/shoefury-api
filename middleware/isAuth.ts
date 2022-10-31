import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IAuthUser } from "types/Auth/Auth";

import { createError } from "../utils/createError";

const authError = createError("Not authenticated", 401);

interface IJwtPayload extends IAuthUser, jwt.JwtPayload {}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.get("Authorization")?.split(" ")[1] ?? "";
  let decodedToken;

  try {
    decodedToken = jwt.verify(
      token,
      `${process.env.SECRET_KEY}`
    ) as IJwtPayload;
  } catch (error) {
    next(authError);
  }

  if (decodedToken === undefined) {
    next(authError);
    return;
  }
  if (decodedToken === null || decodedToken === undefined) return;
  req.body.userId = decodedToken.userId;

  next();
};
