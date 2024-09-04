// import modules:
import { Coupon } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { couponTypes } from "../../utils/constant/role-identification.js";

// add a coupon
export const addCoupon = async (req, res, next)=>{
    // get data from req:
    const {couponCode, couponType, discountAmount, fromDate, toDate} = req.body;
    // check coupon existence:
    const couponExist = await Coupon.findOne({couponCode})
    if(couponExist){
     return next(new AppError(messages.coupon.alreadyExist, 409))
    }
    // check on coupon type and discountAmount:
    if(couponType == couponTypes.PERCENTAGE && discountAmount > 100){
      return next(new AppError('Coupon has to be less than 100', 400))
    }
    // prepare and ceate coupon
    const coupon = new Coupon({
    couponCode,
    couponType,
    discountAmount,
    fromDate,
    toDate,
    createdBy:req.authUser._id,
    })
    const created_coupon = await coupon.save()
    if(!created_coupon){
     return next(new AppError(messages.coupon.failToCreate, 500))
     
    }
    return res.status(201).json({message:messages.coupon.createdSuccessfully, data: created_coupon, success: true})
}
// get all coupons:
export const getCoupons = async(req, res, next)=>{
  const coupons = await Coupon.find()
  return res.status(200).json({success: true, data: coupons})
}
// get specific coupon
export const getSpecificCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const SpecificCoupon = await Coupon.findById(couponId)
  if (!SpecificCoupon) {
    return next(new AppError(messages.coupon.notFound, 404));
  }
  return res.status(200).json({ success: true, data: SpecificCoupon});
};
// update coupon:
export const updateCoupon = async (req, res, next)=>{
  const {couponId} =req.params
  const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, req.body, {new: true})
  if(!updatedCoupon){
   return next(new AppError(messages.coupon.failToUpdate, 500))
  }
  return res.status(200).json({message:messages.coupon.updatedSuccessfully, success: true, data:updatedCoupon})
}
// delete coupon:
export const deleteCoupon = async (req, res, next) =>{
 const {couponId} = req.params
  const specificCoupon = await Coupon.findByIdAndDelete(couponId);
    if (!specificCoupon) {
      return next(new AppError(messages.coupon.notFound, 404));
    }
   return res.status(200).json({ success: true, data: messages.coupon.deletedSuccessfully });
}