// import modules:
import { model, Schema } from "mongoose";
// schema:
const categorySchema = new Schema(
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
    image: {
      type: Object,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

  categorySchema.virtual('subCategory', {
    ref: 'subCategory',
    foreignField: 'category',
    localField:'_id'
  })
  categorySchema.virtual("Product", {
    ref: "Product",
    foreignField: "category",
    localField: "_id",
  });
  // file upload:
  categorySchema.post('init', function(doc){
    doc.image = "http://localhost:3000/uploads/categories/" + doc.image;
     
  })
// model:
export const Category = model("Category", categorySchema);
