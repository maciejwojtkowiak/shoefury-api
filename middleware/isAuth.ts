import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from '../types/Error';
import { errorModel } from '../utils/error';

interface IUserIdRequest extends Request {
  userId: string;
}

interface IUserPayload {
  userId: string;
}

const authError = errorModel('Not authenticated', 401);

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.get('Authorization')!.split(' ')[1];
  let decodedToken;
  console.log("IS AUTH")

  try {
    decodedToken = jwt.verify(token, `${process.env.SECRET_KEY}`) as IUserPayload;
    console.log("DECODED", decodedToken)
  } catch (err) {
    console.log(err)
    next(authError);
  }
  if (!decodedToken) {

    next(authError);
  }

  req.body.userId = decodedToken?.userId;
  next();
};
