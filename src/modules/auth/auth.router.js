// import modules:
import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { uploadSingleFile } from "../../utils/fileUpload.js";
import { validate } from "../../middlewares/validate.js";
import { loginVal, signupVal } from "./auth.validation.js";
import {
  changeUserPassword,
  forgetUserPassword,
  logIn,
  signup,
  verifyAccount,
} from "./auth.controller.js";
// create router:
const authRouter = Router();
// sign up function:
authRouter.post(
  "/signup",
  uploadSingleFile(),
  validate(signupVal),
  asyncHandler(signup)
);
// verify account api:
authRouter.get("/verify-account", asyncHandler(verifyAccount));
// login function:
authRouter.post("/login", validate(loginVal), asyncHandler(logIn));
// forget password api:
authRouter.post("/forget-password", asyncHandler(forgetUserPassword));
// change user password api:
authRouter.post("/change-password", asyncHandler(changeUserPassword));
// EXPORT
export default authRouter;
