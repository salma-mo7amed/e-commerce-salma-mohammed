// import modules:
import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authentication.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { addProductToCart, clearCart, getLoggedUserCart, removeProductFromCart } from "./cart.controller.js";
import { validate } from "../../middlewares/validate.js";
import { addCartVal, removeCartVal } from "./cart.validation.js";
// create router:
const cartRouter = Router();
// add products to cart:
cartRouter.post(
  "/",
  isAuthenticated(),
  validate(addCartVal),
  asyncHandler(addProductToCart)
);
// get logged user cart:
cartRouter.get('/', isAuthenticated(), asyncHandler(getLoggedUserCart))
// remove product from cart:
cartRouter.patch(
  "/",
  isAuthenticated(),
  validate(removeCartVal),
  asyncHandler(removeProductFromCart)
);
// clear cart:
cartRouter.delete(
  "/",
  isAuthenticated(),
  asyncHandler(clearCart)
);

// export
export default cartRouter;
