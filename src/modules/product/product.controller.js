import slugify from "slugify";
import { Brand } from "../../../db/models/brand.model.js";
import { Category } from "../../../db/models/category.model.js";
import { subCategory } from "../../../db/models/subCategory.model.js";
import { AppError } from "../../utils/appError.js";
import { Product } from "../../../db/models/product.model.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { messages } from "../../utils/constant/messages.js";

// add a product:
export const addProduct = async (req, res, next)=>{
  // get data from req
  let {
    title,
    slug,
    description,
    category,
    subcategory,
    brand,
    mainImage,
    subImages,
    price,
    discount,
    size,
    colors,
    stock,
    createdBy
  } = req.body;
  //  check category existence
  const categoryExist = await Category.findById(category);
  if (!categoryExist) {
     req.failImage = req.file.path;
    return next(new AppError(messages.category.notFound, 404));
  }
  //  check sub-category existence
  const subCategoryExist = await subCategory.findById(subcategory);
  if (!subCategoryExist) {
     req.failImage = req.file.path;
    return next(new AppError(messages.subcategory.notFound, 404));
  }
  //  check brand existence
  const brandExist = await Brand.findById(brand);
  if (!brandExist) {
     req.failImage = req.file.path;
    return next(new AppError(messages.brand.notFound, 404));
  }
  // check logo existence:
//   if (!req.file) {
//     return next(new AppError("image is required", 400));
//   }
  // prepare data
  slug = slugify(title);
  const product = new Product({
    title,
    slug,
    description,
    category,
    subcategory,
    brand,
    mainImage:req.files.mainImage[0].filename,
    subImages:req.files.subImages.map(img=>img.filename),
    price,
    discount,
    size:JSON.parse(size),
    colors:JSON.parse(colors),
    stock,
    createdBy:req.authUser._id
  });
  let createdProduct = await product.save()
  if(!createdProduct){
     req.failImage = req.file.path; 
    return next(new AppError(messages.product.failToCreate), 500)
  }
   return res.status(201).json({message: messages.product.createdSuccessfully, success:true, data: createdProduct})
}
// get all products
export const getAllProducts = async (req, res, next)=>{
    const apiFeature = new ApiFeature(Product.find().populate('category brand subcategory'), req.query).pagination().sort().select().filter()
    const products = await apiFeature.mongooseQuery
    return res.status(200).json({success:true, data: products})
}
// get specific product
export const getSpecificProduct = async (req, res, next) => {
   const {id} = req.params;
    const specificProduct = await Product.findById(id).populate('category brand subcategory')
     specificProduct || next(new AppError(messages.product.notFound, 404));
    !specificProduct || res.status(200).json({success:true, data: specificProduct})
}
// update product
export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  let { title, slug, mainImage } = req.body;

  const productExist = await Product.findById(id);
  if (!productExist) {
     req.failImage = req.file.path;
    return next(new AppError(messages.product.notFound), 404);
  }
  if (req.file) {
    // delete old image
    deleteFile(productExist.mainImage);
   deleteFile(productExist.subImages);
    
    // update new image
    productExist.mainImage = req.file.filename;
  }
  if (title) {
    productExist.title = title;
    productExist.slug = slugify(title);
  }
  const updatedProduct = await productExist.save();
  if (!updatedProduct) {
    req.failImage = req.file.path;
    return next(new AppError(messages.product.failToUpdate), 500);
  }
  return res
    .status(200)
    .json({
      message: messages.product.updatedSuccessfully,
      data: updatedProduct,
      success: true,
    });
};
// delete product:
export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  //   check product existence
  const productExist = await Product.findByIdAndDelete(productId);
  if (!productExist) {
    return next(new AppError(messages.product.notFound), 404);
  }
  //   prepare ids:
  const categories = await Category.find({ Product:productId }).select( "image");
  const subcategories = await subCategory.find({ Product: productId }).select("image");
   const brands = await Brand.find({ Product: productId }).select("logo");
  const categoriesIds = categories.map((category) => category._id);
  const subcategoriesIds = subcategories.map((sub) => sub._id);
   const brandsIds = brands.map((brand) => brand._id);
  //   delete subcategories and products:
  await Category.deleteMany({ _id: { $in: categoriesIds } });
  await Brand.deleteMany({ _id: { $in: brandsIds } });
   await subCategory.deleteMany({ _id: { $in: subcategoriesIds } });
  //  delete images:
  const imagePaths =
    categories.map((category) => category.image) &&
    subcategories.map((sub) => sub.image) &&
    brands.map((brand) => brand.image);


  for (let i = 0; i < imagePaths.length; i++) {
    deleteFile(imagePaths[i]);
  }
  return res.status(200).json({
    message: messages.product.deletedSuccessfully,
    success: true,
  });
     
};