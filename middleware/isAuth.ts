import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthUser } from '../types/User';
import { createError } from '../utils/createError';

const authError = createError('Not authenticated', 401);

interface IJwtPayload extends IAuthUser, jwt.JwtPayload {}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.get('Authorization')!.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, `${process.env.SECRET_KEY}`) as IJwtPayload
  } catch (error) {
    next(authError);
  }
  if (!decodedToken || !decodedToken.userId) {
    next(authError);
  } 

  if (decodedToken) {
    req.body.userId = decodedToken.userId;
  }
  next();
};
