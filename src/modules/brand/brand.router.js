// import modules:
import { Router } from "express";
import {
  addBrand,
  deleteBrand,
  getAllBrands,
  getSpecificBrand,
  updateBrand,
} from "./brand.controller.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { uploadSingleFile } from "../../utils/fileUpload.js";
import { validate } from "../../middlewares/validate.js";
import {
  addBrandVal,
  deleteBrandVal,
  getSpecificBrandVal,
  updateBrandVal,
} from "./brand.validation.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";
import { roles } from "../../utils/constant/role-identification.js";
// create router:
const brandRouter = Router();
// add a brand:
brandRouter.post(
  "/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  uploadSingleFile("logo", "brands"),
  validate(addBrandVal),
  asyncHandler(addBrand)
);
// get all brands:
brandRouter.get(
  "/",
  asyncHandler(getAllBrands)
);
// get a specific brand:
brandRouter.get(
  "/:id",
  validate(getSpecificBrandVal),
  asyncHandler(getSpecificBrand)
);
// update a brand:
brandRouter.put(
  "/:id",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  uploadSingleFile("logo", "brands"),
  validate(updateBrandVal),
  asyncHandler(updateBrand)
);
// delete a brand
brandRouter.delete(
  "/:id",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  validate(deleteBrandVal),
  asyncHandler(deleteBrand)
);
// export router:
export default brandRouter;
