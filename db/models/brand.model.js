// import modules:

import { model, Schema } from "mongoose";

// schema:
const brandSchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      lowerCase: true,
    },
    slug: {
      type: String,
      lowerCase: true,
      required: true,
    },
    logo: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// virtual:
brandSchema.virtual("Product", {
    ref: "Product",
    foreignField: "brand",
    localField: "_id"}
  )
 brandSchema.post("init", function (doc) {
   doc.logo = "http://localhost:3000/uploads/brands/" + doc.logo;
 });
// model:
export const Brand = model('Brand', brandSchema)