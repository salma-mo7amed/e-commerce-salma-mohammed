// import modules:

import { Order, Product, Review } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// add a review:
export const addReview = async (req, res, next) => {
  const { comment, rate } = req.body
  const{productId, orderId }= req.query
  
  //  check existence of the product:
  const productExist = await Product.findById( productId );
  if (!productExist) {
    return next(new AppError(messages.product.notFound, 404));
  }
  //  check order existence
  const isOrderExist = await Order.findById(orderId)
  if(!isOrderExist){
     return next(new AppError(messages.order.notFound, 404));
  }
  // check he has a review:
  const reviewExist = await Review.findOneAndUpdate(
    { user : req.authUser._id, product: productId} ,
    { comment, rate },
    { new: true }
  );
  let message = messages.review.updatedSuccessfully;
  let data = reviewExist
  if (!reviewExist) {
    const review = new Review({
      comment,
      rate,
      user: req.authUser._id,
      product: productId,
      order:orderId
    });
    const createdReview = await review.save()
    if(!createdReview){
     return next(new AppError(messages.review.failToCreate, 500))
    }
    message = messages.review.createdSuccessfully
    data = createdReview
  }
  return res.status(200).json({message, success:true, data})
};
// get all reviews:
export const getAllReviews = async (req, res, next)=>{
  const reviews= await Review.find().populate('product user order')
  return res.status(200).json({success: true, data:reviews})
}
// get specific review:
export const getSpecificReview = async (req, res, next) => {
  const {reviewId} = req.params
  const specificReview = await Review.findById(reviewId).populate('user product order')
  if(!specificReview){
    return next(new AppError(messages.review.notFound, 404))
  }
  return res.status(200).json({ success: true, data: specificReview });
};
// delete review:
export const deleteReview = async (req, res, next )=>{
    const { reviewId } = req.params
  const specificReview = await Review.findByIdAndDelete(reviewId);
  if (!specificReview) {
    return next(new AppError(messages.review.notFound, 404));
  }

   return res.status(200).json({ success: true, data: messages.review.deletedSuccessfully });
  }   
   
