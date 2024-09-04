// import modules:
import { model, Schema } from "mongoose";
// schema:
const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      min: 0,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true, versionKey: false }
);
// model:
export const Review = model("Review", reviewSchema);
