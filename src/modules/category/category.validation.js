// import modules:
import joi from 'joi'
import { generalFields } from '../../middlewares/validate.js';
// joi validation:
// add category validation:
export const addCategoryVal = joi.object({
  name: generalFields.name.min(4).max(200).required(),
  slug: generalFields.name.min(4).max(200),
  createdBy: generalFields.objectId
  
});
// get specific category validation:
export const getSpecificCategoryVal = joi.object({
  id: generalFields.objectId.required()
});
// update specific category validation
export const updateCategoryVal = joi.object({
  name: generalFields.name.min(4).max(200),
  slug:generalFields.name.min(4).max(200),
  id:generalFields.objectId.required()
});
// delete category validation:
export const deleteCategoryVal = joi.object({
  id: generalFields.objectId.required(),
});