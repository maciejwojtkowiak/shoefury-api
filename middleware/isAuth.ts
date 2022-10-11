import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthUser } from '../types/User';
import { createError } from '../utils/createError';

const authError = createError('Not authenticated', 401);

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.get('Authorization')!.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, `${process.env.SECRET_KEY}`) as IAuthUser;
    console.log("DECODED", decodedToken)
  } catch (error) {
    next(authError);
  }
  if (!decodedToken) {
    next(authError);
  } 

  if (decodedToken) {
    req.body.userId = decodedToken.userId;
  }
  next();
};
