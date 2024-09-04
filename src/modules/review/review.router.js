// import modules:
import { Router } from "express";
import {
  isAuthenticated,
  isAuthorized,
 
} from "../../middlewares/authentication.js";

import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { addReview, deleteReview, getAllReviews, getSpecificReview } from "./review.controller.js";
import { validate } from "../../middlewares/validate.js";
import { addReviewVal, getSpecificReviewVal } from "./review.validation.js";
import { roles } from "../../utils/constant/role-identification.js";

// create router:
const reviewRouter = Router();
// review crud:
// add and update a review:
reviewRouter.post(
  "/",
  isAuthenticated(),
  validate(addReviewVal),
  asyncHandler(addReview)
);
// get specific review:
reviewRouter.get(
  "/:reviewId",
  validate(getSpecificReviewVal),
  asyncHandler(getSpecificReview)
);
// get all reviews:
reviewRouter.get('/', asyncHandler(getAllReviews))
// delete review:
reviewRouter.delete('/:reviewId',
isAuthenticated(),
isAuthorized([roles.ADMIN, roles.CUSTOMER]),
asyncHandler(deleteReview)
)


// export
export default reviewRouter;
