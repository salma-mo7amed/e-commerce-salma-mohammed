// import modules:
import { Router } from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";
import { validate } from "../../middlewares/validate.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import {
  addCoupon,
  deleteCoupon,
  getCoupons,
  getSpecificCoupon,
  updateCoupon,
} from "./coupon.controller.js";
import { addCouponVal } from "./coupon.validation.js";
import { roles } from "../../utils/constant/role-identification.js";

// create router:
const couponRouter = Router();
// create coupon:
couponRouter.post(
  "/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  validate(addCouponVal),
  asyncHandler(addCoupon)
);
// delete specific coupon:
couponRouter.delete(
  "/:couponId",
  isAuthenticated(), 
  isAuthorized([roles.ADMIN]),
 asyncHandler(deleteCoupon))
;
// get specific coupon
couponRouter.get(
  "/:couponId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  asyncHandler(getSpecificCoupon)
);
// get all coupons:
couponRouter.get(
  "/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  asyncHandler(getCoupons)
);

// update coupon:
couponRouter.put(
  "/:couponId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  asyncHandler(updateCoupon)
);

//export
export default couponRouter;
