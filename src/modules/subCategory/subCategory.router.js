// import modules:
import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import {
  addSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSpecificSubCategory,
  getSubCategories,
  updateSubCategory,
} from "./subCategory.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  addSubCategoryVal,
  deleteSubCategoryVal,
  getSpecificSubCategoryVal,
  getSubCategoryVal,
  updateSubCategoryVal,
} from "./subCategory.validation.js";
import { uploadSingleFile } from "../../utils/fileUpload.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";
import { roles } from "../../utils/constant/role-identification.js";

// create router:
const subCategoryRouter = Router();
// add a subcategory:
subCategoryRouter.post(
  "/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  uploadSingleFile("image", "sub-categories"),
  validate(addSubCategoryVal),
  asyncHandler(addSubCategory)
);
// get all subcategories:
subCategoryRouter.get(
  "/",
  asyncHandler(getAllSubCategories)
);
// get subcategories with their category:
subCategoryRouter.get(
  "/:categoryId",
  validate(getSubCategoryVal),
  asyncHandler(getSubCategories)
);
// get a specific subcategory:
subCategoryRouter.get(
  "/:id",
  validate(getSpecificSubCategoryVal),
  asyncHandler(getSpecificSubCategory)
);
// update a subcategory:
subCategoryRouter.put(
  "/:id",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  uploadSingleFile("image", "sub-categories"),
  validate(updateSubCategoryVal),
  asyncHandler(updateSubCategory)
);
// delete a subcategory
subCategoryRouter.delete(
  "/:subcategoryId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  validate(deleteSubCategoryVal),
  asyncHandler(deleteSubCategory)
);
// export:
export default subCategoryRouter;
