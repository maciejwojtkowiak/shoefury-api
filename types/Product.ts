import { ObjectId } from 'mongoose';

export interface IProduct {
  _id: ObjectId;
  description: string;
  title: string;
  price: string;
  imageData: string;
}
