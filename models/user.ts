import mongoose, { Model, ObjectId, Schema } from 'mongoose';

import bcrypt from 'bcrypt';


interface Item {
  product: ObjectId;
  quantity: number;
}

interface ICart {
  items: Item[]
}


export interface IUser {
  name: string;
  email: string;
  password: string;
  cart: ICart
}

interface IUserMethods {
  setPassword(password: string): void;
  decryptPasswordSuccess(password: string): void;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const user = new Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },

  password: {
    type: String,
  },

});

user.method(
  'setPassword',
  function setPassword(password) {
    this.password = bcrypt.hash(password, 16);
  },
  { collection: 'users' }
);

const User = mongoose.model<IUser, UserModel>('User', user);
export default User;
