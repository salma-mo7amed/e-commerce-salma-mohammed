// import modules:
import joi from "joi";
import { generalFields } from "../../middlewares/validate.js";
// joi validation:
// add category validation:
export const addBrandVal = joi.object({
  name: generalFields.name.min(4).max(200).required(),
  slug: generalFields.name.min(4).max(200),
  // createdBy: generalFields.objectId,

  // logo: joi.string(),
});
// get specific category validation:
export const getSpecificBrandVal = joi.object({
  id: generalFields.objectId.required(),
});
// update specific category validation
export const updateBrandVal = joi.object({
  name: generalFields.name.min(4).max(200),
  slug: generalFields.name.min(4).max(200),
  id: generalFields.objectId.required(),
});
// delete category validation:
export const deleteBrandVal = joi.object({
  id: generalFields.objectId.required(),
});
