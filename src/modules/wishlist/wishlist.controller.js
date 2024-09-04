// import modules:

import { Product } from "../../../db/models/product.model.js";
import { User } from "../../../db/models/user.model.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";


// add product to wishlist:
export const addProductToWishlist = async (req, res, next)=>{
// get data from req:
const {productId} = req.body;
const {authUser} = req
// check product existence:
 const productExist = await Product.findById(productId)
 if(!productExist){
 return next(new AppError(messages.product.notFound, 404))
 }
   const updated_user = await User.findByIdAndUpdate(req.authUser._id, {$addToSet:{wishlist: productId}},{new:true})
   return res.status(200).json({message: messages.wishlist.updatedSuccessfully, 
    success:true, 
    data: updated_user})
}
// delete wishlist:
export const deleteWishlist = async (req, res, next) =>{
    const {productId} = req.params
   const wishlist = await User.findByIdAndUpdate(req.authUser._id, {
        $pull:{
            wishlist :productId
        }
    },{new: true}).select('wishlist')
    return res.status(200).json({message:messages.wishlist.deletedSuccessfully, success:true, data:wishlist})
}
// get logged user wishlist:
export const getUserWishlist = async(req, res, next)=>{
 const user = await User.findById(req.authUser._id, {wishlist:1}, {populate:[{path:"wishlist"}]})
 return res.status(200).json({success: true, data: user})
}