// import modules
import mongoose, { model, Schema } from "mongoose";

// schema:
const productSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    subImages: [String],
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    size: [String],
    colors: [String],
    stock: {
      type: Number,
      min: 0,
      default: 1,
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
productSchema.virtual('finalPrice').get(function(){
  return this.price -(this.price * ((this.discount || 0) / 100))
})
// method
productSchema.methods.inStock = function(quantity){
 return this.stock >= quantity ? true : false
}
// file upload paths:
  productSchema.post("init", function (doc) {
    doc.mainImage = "http://localhost:3000/uploads/products/" + doc.mainImage;
    doc.subImages = "http://localhost:3000/uploads/products/" + doc.subImages;
  });
// model:
export const Product = model('Product', productSchema)