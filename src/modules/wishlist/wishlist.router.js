// import modules:
import { Router } from "express"; 
import { isAuthenticated, isAuthorized } from "../../middlewares/authentication.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { addProductToWishlist, deleteWishlist, getUserWishlist} from "./wishlist.controller.js";
import { roles } from "../../utils/constant/role-identification.js";
// create Router:
const wishlistRouter= Router()
// add product to Wishlist
wishlistRouter.put('/', isAuthenticated(),isAuthorized([roles.CUSTOMER]) , asyncHandler(addProductToWishlist))
// delete wishlist
wishlistRouter.delete('/:productId', 
isAuthenticated(),
isAuthorized([roles.CUSTOMER]),
asyncHandler(deleteWishlist))
// get logged user wishlist
wishlistRouter.get('/', 
    isAuthenticated(),
    isAuthorized([roles.CUSTOMER]),
    asyncHandler(getUserWishlist))
// export
export default wishlistRouter