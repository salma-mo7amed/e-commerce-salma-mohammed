// import modules:
import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { addProduct, getAllProducts, getSpecificProduct, updateProduct } from "./product.controller.js";
import { uploadMixedFiles } from "../../utils/fileUpload.js";
import { validate } from "../../middlewares/validate.js";
import { addProductVal, deleteProductVal, getSpecificProductVal, updateProductVal } from "./product.validation.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../../middlewares/authentication.js";
import { roles } from "../../utils/constant/role-identification.js";
// create router:
const productRouter = Router();
// add a product:
productRouter.post(
  "/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  uploadMixedFiles(
    [
      { name: "mainImage", maxCount: 1 },
      { name: "subImages", maxCount: 5 },
    ],
    "products"
  ),
  validate(addProductVal),
  asyncHandler(addProduct)
);
// get all products
productRouter.get("/", asyncHandler(getAllProducts));
// get specific product
productRouter.get('/:id', validate(getSpecificProductVal),asyncHandler(getSpecificProduct))
// update product
productRouter.put(
  "/:id",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  uploadMixedFiles(
    [
      { name: "mainImage", maxCount: 1 },
      { name: "subImages", maxCount: 5 },
    ],
    "products"
  ),
  validate(updateProductVal),
  asyncHandler(updateProduct)
);
// delete product
productRouter.delete(
  "/:productId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  validate(deleteProductVal),
  asyncHandler(deleteProductVal)
);
// export
export default productRouter;
