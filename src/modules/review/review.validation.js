// import modules:'
import joi from 'joi';
import { generalFields } from '../../middlewares/validate.js'
    

// add review validation:
export const addReviewVal = joi.object({
  comment: generalFields.comment.required(),
  rate: joi.number().min(0).max(5),
  productId: generalFields.objectId.required(),
  orderId: generalFields.objectId.required(),
});
// get specific review validation:
export const getSpecificReviewVal = joi.object({
  reviewId: generalFields.objectId.required()
})
// delete review validation:
export const deleteReviewVal = joi.object({
  reviewId: generalFields.objectId.required()
})
