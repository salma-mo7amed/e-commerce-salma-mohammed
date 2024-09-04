// import modules:
import joi from "joi";
import { generalFields } from "../../middlewares/validate.js";
// joi validation:
// add sub-category validation:
export const addSubCategoryVal = joi.object({
  name: generalFields.name.min(4).max(200).required(),
  slug: generalFields.name.min(4).max(200),
  category: generalFields.objectId,
});
// get specific sub-category validation:
export const getSpecificSubCategoryVal = joi.object({
  id: generalFields.objectId.required(),
});
export const getSubCategoryVal = joi.object({
  categoryId: generalFields.objectId.required(),
});
// update specific sub-category validation
export const updateSubCategoryVal = joi.object({
  name: generalFields.name.min(4).max(200),
  slug: generalFields.name.min(4).max(200),
  category: generalFields.objectId,
  id: generalFields.objectId.required(),
});
// delete sub-category validation:
export const deleteSubCategoryVal = joi.object({
  id: generalFields.objectId.required(),
});
