// import modules:
import joi from "joi";
import { generalFields } from "../../middlewares/validate.js";
// function to parse array:
const parseArray =(value, helper)=>{
 value = JSON.parse(value)
 const schema = joi.array().items(joi.string())
 const { error} = schema.validate(value, {abortEarly:false})
 if(error){
    return helper('invalid array')
 }
 else{
    return true
 }
}
// add product validation
export const addProductVal = joi.object({
  title: generalFields.name,
  description: generalFields.name,
  category: generalFields.objectId.required(),
  subcategory: generalFields.objectId.required(),
  brand: generalFields.objectId.required(),
  price: joi.number().min(0).required(),
  discount: joi.number(),
  size: joi.custom(parseArray),
  colors: joi.custom(parseArray),
  stock: joi.number().min(0),
});
  
// get specific product validation:
export const getSpecificProductVal = joi.object({
  id: generalFields.objectId.required()
});
// update product validation
export const updateProductVal = joi.object({
  title: generalFields.name.min(4).max(200),
  slug:generalFields.name.min(4).max(200),
  id:generalFields.objectId.required()
});
// delete category validation:
export const deleteProductVal = joi.object({
  id: generalFields.objectId.required(),
});