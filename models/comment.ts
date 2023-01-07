import mongoose, { Schema } from "mongoose";
import { IComment } from "types/Comment/Comment";

const comment = new Schema<IComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentContent: {
      type: String,
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { collection: "comments", timestamps: true }
);

const Comment = mongoose.model("Comment", comment);
export default Comment;
