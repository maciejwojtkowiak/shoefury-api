import { Types } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;
  commentContent: string;
  userId: Types.ObjectId;
  productId: Types.ObjectId;
}

export interface IAddComment {
  commentContent: string;
}
