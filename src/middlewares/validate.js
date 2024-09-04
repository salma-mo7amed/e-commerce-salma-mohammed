// import modules:
import joi from "joi";
import { AppError } from "../utils/appError.js";

// val schema for joi:
export const generalFields = {
  name: joi.string(),
  comment: joi.string(),
  couponCode: joi.string(),
  couponType: joi.string(),
  discountAmount: joi.number(),
  email: joi.string().email(),
  password: joi.string().required(),
  rePassword: joi.string().valid(joi.ref("password")),
  objectId: joi.string().hex().length(24),
};
// validaion middleware:
export const validate = (schema) => {
  return (req, res, next) => {
    let { error } = schema.validate({...req.body, ...req.params, ...req.query}, { abortEarly: false });
    if (error) {
      return next(new AppError(error?.details, 400))
    }
    next()
  };
};