import express, { Request, Response } from 'express';
import { isAuth, login, register } from '../controllers/auth';
import { body, Meta } from 'express-validator';
import User from '../models/user';

const router = express.Router();

router.get('/register', (req: Request, res: Response) => {
  res.status(200).json({ message: 'User created!' });
});

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .custom(async (value: string, req: Meta) => {
        const userWithGivenEmail = await User.findOne({ email: value });
        if (userWithGivenEmail) {
          throw new Error('User already exists');
        }
      })
      .normalizeEmail(),
    body('password').trim(),
  ],
  register
);

router.patch('/login', login);

router.patch('/is-auth', isAuth);

export default router;
