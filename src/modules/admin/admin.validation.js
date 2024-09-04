import joi from "joi";
import { generalFields } from "../../middlewares/validate.js";
// add a user validation:
export const addUserVal = joi.object({
  userName: generalFields.name.required(),
  email: generalFields.email.required(),
  phone: joi.string(),
  role:joi.string()
});
// GET SPECIFIC USER VALIDATION:
export const getSpecificUserVal = joi.object({
  id: generalFields.objectId.required(),
});