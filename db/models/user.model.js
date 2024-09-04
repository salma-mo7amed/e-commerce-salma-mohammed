// import modules:
import path from 'path';
import dotenv from 'dotenv';
import { model, Schema } from "mongoose";
import { roles, status } from "../../src/utils/constant/role-identification.js";
dotenv.config({path:path.resolve('./config/.env')})
// schema:
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    rePassword: {
      type: String,
    },
    phone: {
      type: String,
    },
    image: {
      type: Object,
      default: {
        secure_url: process.env.SECURE_URL,
        public_id: process.env.PUBLIC_ID
      },
    },
    DOB: {
      type: Date,
    },

    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.CUSTOMER,
    },
    status: {
      type: String,
      enum: Object.values(status),
      default: status.PENDING,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    address: [
      {
        street: String,
        city: String,
        phone: String,
      },
    ],
    wishlist: [
   { 
    type: Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    otp: Number,
    otpExpireDate: Date,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// model:
export const User = model("User", userSchema);
