// import modules:
import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../../middlewares/authentication.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { cancelOrder,  createOrder, getAllOrders, getLoggedUserOrders,  } from "./order.controller.js";
import { roles } from "../../utils/constant/role-identification.js";
// create router:
const orderRouter = Router()
// create an order:
orderRouter.post('/', isAuthenticated(), asyncHandler(createOrder));
// get all orders:
orderRouter.get('/loggeduser', isAuthenticated(), asyncHandler(getLoggedUserOrders))
// get all orders:
orderRouter.get('/all-orders', isAuthenticated(),isAuthorized([roles.ADMIN]), asyncHandler(getAllOrders))
// cancel an order:
orderRouter.put('/:orderId',isAuthenticated(), asyncHandler(cancelOrder))

// export:
export default orderRouter