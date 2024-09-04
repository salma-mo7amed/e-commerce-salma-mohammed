// import modules:
import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import {
  addCategory,
  addCloudCategory,
  deleteCategory,
  deleteCloudCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
  updateCloudCategory,
} from "./category.controller.js";
import { uploadSingleFile } from "../../utils/fileUpload.js";
import { validate } from "../../middlewares/validate.js";
import {
  addCategoryVal,
  deleteCategoryVal,
  getSpecificCategoryVal,
  updateCategoryVal,
} from "./category.validation.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";
import { roles } from "../../utils/constant/role-identification.js";
import { fileCloudUpload } from "../../utils/multer-cloud.js";
// create router:
const categoryRouter = Router();
// add a category:
categoryRouter.post(
  "/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  uploadSingleFile("image", "categories"),
  validate(addCategoryVal),
  asyncHandler(addCategory)
);
// get all categories:
categoryRouter.get(
  "/",
  asyncHandler(getAllCategories)
);
// get a specific category:
categoryRouter.get(
  "/:id",
  validate(getSpecificCategoryVal),
  asyncHandler(getSpecificCategory)
);
// update a category:
categoryRouter.put(
  "/:id",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  uploadSingleFile("image", "categories"),
  validate(updateCategoryVal),
  asyncHandler(updateCategory)
);
// delete a category
categoryRouter.delete(
  "/:categoryId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  validate(deleteCategoryVal),
  asyncHandler(deleteCategory)
);
/****************************************************/ 
// add category on cloudinary:
categoryRouter.post('/cloud',
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  fileCloudUpload().single('image'),
  asyncHandler(addCloudCategory)
)
// delete category on cloudinary:
categoryRouter.delete(
  "/cloud/:categoryid",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  fileCloudUpload().single('image'),
  asyncHandler(deleteCloudCategory)

);
// update category on cloudinary:
categoryRouter.put(
  "/cloud/:categoryid",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  fileCloudUpload().single('image'),
  asyncHandler(updateCloudCategory)

);
// export router:
export default categoryRouter;
