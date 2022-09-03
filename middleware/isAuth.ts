import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from '../types/Error';

interface IUserIdRequest extends Request {
  userId: string;
}

interface IUserPayload {
  userId: string;
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.get('Authorization')!.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, `${process.env.SECRET_KEY}`) as IUserPayload;
  } catch (err) {
    const error = new Error('Not authenticated') as CustomError;
    error.status = 401;
    next(error);
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated') as CustomError;
    error.status = 401;
    next(error);
  }

  req.body.userId = decodedToken?.userId;

  next();
};
