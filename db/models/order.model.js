// import modules:
import { Schema, model } from "mongoose";
import { orderStatus, paymentMethods } from "../../src/utils/constant/role-identification.js";
// schema:
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        productPrice: Number,
        quantity: {
          type:Number, 
          default:1
        },
        frinalPrice: Number,
      },
    ],
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    coupon: {
      couponId: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
      },
      couponCode: String,
      discount: Number,
    },
    payment: {
      type: String,
      enum: Object.values(paymentMethods),
      default: paymentMethods.CASH,
    },
    orderStatus: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.PLACED,
    },
    orderPrice: {
      type: Number,
    },
    finalPrice: {
      type: Number,
    }
  },
  { timestamps: true, versionKey: false }
);
// model:
export const Order = model('Order', orderSchema)