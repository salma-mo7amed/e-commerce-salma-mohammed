// import modules:
import joi from "joi";
import { generalFields } from "../../middlewares/validate.js";
import { couponTypes } from "../../utils/constant/role-identification.js";
// ADD coupon validation:
export const addCouponVal = joi.object({
couponCode: joi.string().length(6).required(),
couponType:generalFields.couponType.valid(...Object.values(couponTypes)),
discountAmount:generalFields.discountAmount.positive().min(10),
fromDate:joi.date().greater(Date.now()- 24 * 60 * 60 * 1000),
toDate: joi.date().greater(joi.ref('fromDate'))
}) 
