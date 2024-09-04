// import modules:
import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../../middlewares/authentication.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { deleteUser, getLoggedUser, resetUserPassword, updateUser } from "./user.controller.js";
import { roles } from "../../utils/constant/role-identification.js";
// create router:
const userRouter = Router();
// get logged user:
userRouter.get(
  "/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.CUSTOMER]),
  asyncHandler(getLoggedUser)
);
// update user:
userRouter.put('/:userId', isAuthenticated(), isAuthorized( roles.CUSTOMER), asyncHandler(updateUser))
// delete user:
userRouter.delete('/:userId', isAuthenticated(), isAuthorized( roles.CUSTOMER), asyncHandler(deleteUser))
// resert password:
userRouter.put('/reset-password', isAuthenticated(),asyncHandler(resetUserPassword))
// export:
export default userRouter