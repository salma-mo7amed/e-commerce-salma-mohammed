// import modules:
import path from "path";
import dotenv from "dotenv";
import Stripe from "stripe";
import { Cart, Coupon, Order, Product } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { orderStatus, paymentMethods } from "../../utils/constant/role-identification.js";
import { url } from "inspector";
dotenv.config({ path: path.resolve("./config/.env") });

// create an order:
export const createOrder = async (req, res, next) => {
  // get data from req:
  const { address, phoneNumber, coupon, payment } = req.body;
  let isCouponExist = { }
if(coupon){
  // check coupon existence:
   isCouponExist = await Coupon.findOne({ couponCode: coupon });
  if (!isCouponExist) {
    return next(new AppError(messages.coupon.notFound));
  }
  if (
    isCouponExist.fromDate > Date.now() ||
    isCouponExist.toDate < Date.now()
  ) {
    return next(new AppError("invalid coupon", 404));
  }
}
  // check user cart:
  const cart = await Cart.findOne({ user: req.authUser._id }).populate(
    "products.productId"
  );
  let products = cart.products;
  if (!products.length <0) {
    return next(new AppError("cart is empty", 400));
  }
  // check products:
  let orderProducts = [];
  let orderPrice = 0;
  for (const product of products) {
    const isProductExist = await Product.findById(product.productId);
    if (!isProductExist) {
      return next(new AppError(messages.product.notFound, 404));
    }
    if (!isProductExist.inStock(product.quantity)) {
      return next(new AppError("product is out of stock", 404));
    }
    orderProducts.push({
      productId: isProductExist._id,
      title: isProductExist.title,
      productPrice: isProductExist.finalPrice,
      quantity: product.quantity,
      frinalPrice: product.quantity * isProductExist.finalPrice,
    });
    orderPrice += product.quantity * isProductExist.finalPrice;
  }
  // prepare order:
  const order = new Order({
    user: req.authUser._id,
    products: orderProducts,
    address,
    phoneNumber,
    coupon: {
      couponId: isCouponExist?._id,
      couponCode: isCouponExist?.couponCode,
      discount: isCouponExist?.discountAmount,
    },
    payment,
    orderStatus: orderStatus.PLACED,
    orderPrice,
    finalPrice:
      orderPrice - orderPrice * ((isCouponExist.discountAmount || 0) / 100),
  });
  //  add to db:

 for (const product of orderProducts) {
    await Product.findByIdAndUpdate({_id: product.productId},{$inc:{stock: -product.quantity}})

 }
   await Cart.findOneAndUpdate({user:req.authUser._id}, { products: [] }, { new: true });
  const createdOrder = await order.save();
 if(!createdOrder){
  return next(new AppError(messages.order.failToCreate, 500))
 }
//  integrate payment:
if(payment == "visa"){
 const stripe = new Stripe(process.env.STRIPE_KEY);
 const checkoutSession = await stripe.checkout.sessions.create({
   success_url: "https://www.google.com",
   cancel_url: "https://www.stripe.com",
   payment_method_types: ["card"],
   mode: "payment",
   line_items: createdOrder.products.map((product) => {
     return {
       price_data: {
         currency: "EGP",
         product_data: {
           name: product.title,
         },
         unit_amount: product.productPrice * 100
       },
       quantity: product.quantity,
     };
   }),
 });
   return res.status(201).json({
       message: messages.order.createdSuccessfully,
       success: true,
       data: createdOrder,
       url: checkoutSession.url
     });
}
 return res.status(201).json({message:messages.order.createdSuccessfully, 
    success: true, 
    data: createdOrder})
};
// get logged user orders:
export const getLoggedUserOrders = async(req, res, next)=>{
    const orders= await Order.find({user:req.authUser._id}).populate('user')
    return res.status(200).json({success: true, data: orders})
}
// get all orders:
export const getAllOrders = async (req, res, next) => {
  const orders = await Order.find().populate('user')
  return res.status(200).json({ success: true, data: orders });
};
// cancel order:
export const cancelOrder = async (req, res, next)=>{
    const {orderId} = req.params;
    const order = await Order.findOne({_id: orderId, user:req.authUser._id})
    if(!order){
        return next(new AppError(messages.order.notFound, 404))
    }
    if(!(order.payment === "cash" && order.orderStatus == "placed")|| (order.payment == paymentMethods.VISA && order.orderStatus != orderStatus.WAITPAYMENT)){
      return next(new AppError('you can not cancel this order in this stage',400))
    }
    await Order.updateOne({_id :orderId},{ orderStatus: "cancelled"})
    
 for (const product of order.products) {
   await Product.findByIdAndUpdate({ _id: product.productId }, { $inc: { stock: product.quantity } }
   );
 }
 return res.status(200).json({message:messages.order.cancelledSuccessfully, success: true})
}
