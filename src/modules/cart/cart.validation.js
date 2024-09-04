import joi from "joi";
import { generalFields } from "../../middlewares/validate.js";

// add cart validation:
export const addCartVal = joi.object({
  productId:generalFields.objectId.required(),
  quantity: joi.number().integer().required(),
 
});
// remove cart validation:
export const removeCartVal = joi.object({
  productId: generalFields.objectId.required()
});