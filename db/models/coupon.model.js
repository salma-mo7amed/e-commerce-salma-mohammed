// import modules:
import { Schema, model } from "mongoose";
import { couponTypes } from "../../src/utils/constant/role-identification.js";
// schema:
const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    couponType: {
    type: String,
    enum: Object.values(couponTypes),
    default: couponTypes.FIXED_AMOUNT,
    },
    discountAmount: {
      type: Number,
      min:10
    
    },
    fromDate: {
      type: String,
      default: Date.now(),
    },
    toDate: {
      type: String,
      default: Date.now() + (24 * 60 * 60 * 1000)
    },
    assignedUsers: [
    {
    user: {type:Schema.Types.ObjectId, ref:'User'},
    max_Usage:{
    type:Number,
     default:2,
     max:5}
     }
    ],
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
  },
  { timestamps: true, versionKey:false }
);
// model
export const Coupon = model("Coupon", couponSchema);
