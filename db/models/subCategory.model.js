// import modules:
import mongoose, { model, Schema } from "mongoose";
// schema:
const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      lowerCase: true,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
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
// virtual
subCategorySchema.virtual("Product", {
  ref: "Product",
  foreignField: "subcategory",
  localField: "_id",
});
 // file upload:
  subCategorySchema.post('init', function(doc){
    doc.image = "http://localhost:3000/uploads/sub-categories/" + doc.image;
     
  })
// model:
 export const subCategory = model("subCategory", subCategorySchema);
