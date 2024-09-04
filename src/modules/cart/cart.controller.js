// import modules:
import { Cart, Product } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// add product to cart:
export const addProductToCart = async (req, res, next) => {
  // get data from req:
  const { productId, quantity } = req.body;
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return next(new AppError(messages.product.notFound, 404));
  }
  // check stock of products:
  if (!productExist.inStock(quantity)) {
    return next(new AppError("product is out of stock", 400));
  }

  // check cart:
  const userCart = await Cart.findOneAndUpdate(
    {
      user: req.authUser._id,
      "products.productId": productId,
    },
    {
      $set: { "products.$.quantity": quantity }
    },
    { new: true }
  );
  let data = userCart
  if (!userCart) {
   data = await Cart.findOneAndUpdate({user:req.authUser._id},
        {$push:{products:{productId, quantity}}},
        {new: true}
    )
  }

  return res.status(200).json({message:messages.cart.updatedSuccessfully, success: true, data})
};
// get logged user cart:
export const getLoggedUserCart = async(req, res, next)=>{
  let userCart = await Cart.findOne({user:req.authUser._id}).populate('products.productId')
  if(!userCart){
    return next(new AppError(messages.cart.notFound, 404))
  }
  return res.status(200).json({success: true, data: userCart})
}
// remove product from cart:
export const removeProductFromCart = async (req, res, next)=> {
  const {productId} = req.body
  const cart = await Cart.findOneAndUpdate(
    {
      user:req.authUser._id,
      "products.productId":productId

    },{
      $pull:{
        products:{productId}
      }
    },

    {new:true}
  )
  if(!cart){
    return next(new AppError(messages.cart.notFound, 404))
  }
  return res.status(200).json({message:messages.product.removedSuccessfully, success:true, data:cart})
}
// clear the whole cart:
export const clearCart = async (req, res, next) => {
 
  const cart = await Cart.findByIdAndUpdate(
     req.authUser._id,
    {products: [] },
     { new: true }
  );
  if(!cart){
     return next(new AppError(messages.cart.notFound, 404))
  }
  return res.status(200).json({ message: messages.cart.clearedSuccessfully,
      success: true,
      data: cart,
    });
};