import { ObjectId } from 'mongoose';

export interface IProduct {
  _id: ObjectId;
  title: string;
  price: string;
  imageData: string;
}
