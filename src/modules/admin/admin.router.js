// import modules:
import { Router } from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";
import { roles } from "../../utils/constant/role-identification.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { addUser, deleteUser, getAllUsers, getSpecificUser, updateUser } from "./admin.controller.js";
import { fileCloudUpload } from "../../utils/multer-cloud.js";

// create router:
const adminRouter = Router();
// add a user:
adminRouter.post(
  "/add",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  fileCloudUpload().single('image'),
  asyncHandler(addUser)
);
// get specific user:
adminRouter.get('/:userId',
  isAuthenticated(),
   isAuthorized([roles.ADMIN]),
    asyncHandler(getSpecificUser))
// get all users:
adminRouter.get('/', 
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  asyncHandler(getAllUsers))
  // update user:
  adminRouter.put('/:userId', 
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    fileCloudUpload().single('image'),
    asyncHandler(updateUser)
  )
    // delete user:
  adminRouter.delete('/:userId', 
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    fileCloudUpload().single('image'),
    asyncHandler(deleteUser)
  )
// export
export default adminRouter;
