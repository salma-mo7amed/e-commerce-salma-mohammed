// import modules:
import slugify from "slugify";
import {subCategory} from "../../../db/models/subCategory.model.js";
import { AppError } from "../../utils/appError.js";
import { Category } from "../../../db/models/category.model.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { messages } from "../../utils/constant/messages.js";
import { Product } from "../../../db/models/product.model.js";
// add a subcategory:
export const addSubCategory = async (req, res, next)=>{
  // get req from body:
  let { name, category, image } = req.body;
  name = name.toLowerCase();
  const categoryExist = await Category.findById(category);
  if (!categoryExist) {
    // to do remove image
    return next(
      new AppError(messages.category.notFound),
      404
    );
  }
  // check image existence:
  if (!req.file) {
    return next(new AppError("Image is required", 404));
  }
  // check sub category existence:
  const subCategoryExist = await subCategory.findOne({ name });
  if (subCategoryExist) {
    //  remove image
     req.failImage = req.file.path;  
    return next(new AppError(messages.subcategory.alreadyExist, 409));
  }
  // create slug:
  const slug = slugify(name);
  // prepare sub category
  const sub_category = new subCategory({
    name,
    slug,
    category,
    image: req.file.filename,
    createdBy:req.authUser._id
  });
  // add to db:
  const createdSubCategory = await sub_category.save();
  if (!createdSubCategory) {
    //  remove image
     req.failImage = req.file.path;
    return next(new AppError(messages.subcategory.failToCreate, 500));
  }
  // send res:
  return res
    .status(201)
    .json({
      message: messages.subcategory.createdSuccessfully,
      data: createdSubCategory,
      success: true,
    });
}
// get all subcategories
export const getAllSubCategories = async(req, res, next)=>{
  const apiFeature = new ApiFeature(subCategory.find().populate('category'), req.query).pagination().sort().select().filter()
   let sub_categories = await apiFeature.mongooseQuery;
   return res.status(200).json({ success: true, data: sub_categories });
}
// get all subcategories related to their category:
export const getSubCategories = async (req, res, next)=>{
  // get data from req:
  const {categoryId} = req.params;
  // check existence:
  const categoryExist = await Category.findById(categoryId)
  if(!categoryExist){
    return next(new AppError(messages.category.notFound, 404))
  }
  const subCategories = await subCategory.find({category:categoryId}).populate('category')
  // send response:
  return res.status(200).json({success:true, data:subCategories })
}
// get a specific subcategory
export const getSpecificSubCategory = async(req, res, next)=>{
    const { id } = req.params;
    const specificSubCategory = await subCategory.findById(id).populate('category');
    specificSubCategory || next(new AppError(messages.subcategory.notFound, 404));
    !specificSubCategory || res.status(200).json({ success: true, data: specificSubCategory });
}
// update subcategory
export const updateSubCategory= async(req, res, next)=>{
   const { id } = req.params;
   let { name, slug, image } = req.body;

   const sub_categoryExist = await subCategory.findById(id);
   if (!sub_categoryExist) {
     return next(new AppError(messages.subcategory.notFound), 404);
   }
   if (req.file) {
     // delete old image
     deleteFile(sub_categoryExist.image);
     // update new image
     sub_categoryExist.image = req.file.filename;
   }
   if (name) {
     sub_categoryExist.name = name;
     sub_categoryExist.slug = slugify(name);
   }
   const updatedSubCategory = await sub_categoryExist.save();
   if (!updatedSubCategory) {
     req.failImage = req.file.path;
     return next(new AppError(messages.subcategory.failToUpdate), 500);
   }
   return res
     .status(200)
     .json({
       message: messages.subcategory.updatedSuccessfully,
       data: updatedSubCategory,
       success: true,
     });  
}
//delete subcategory
export const deleteSubCategory = async(req, res, next)=>{
      const { subcategoryId } = req.params;
      //   check sub-category existence
      const subcategoryExist = await subCategory.findByIdAndDelete(subcategoryId);
      if (!subcategoryExist) {
        return next(new AppError(messages.subcategory.notFound), 404);
      }
      //   prepare ids:
      const categories = await Category.find({ subCategory: subcategoryId }).select("image");
      const products = await Product.find({ subcategory: subcategoryId }).select( "mainImage subImages" );
      const categoriesIds = categories.map((category) => category._id );
      const productsIds = products.map((product) => product._id);
      //   delete subcategories and products:
      await Category.deleteMany({ _id: { $in: categoriesIds } });
      await Product.deleteMany({ _id: { $in: productsIds } });
      //  delete images:
      const imagePaths = categories.map(
        (category) => category.image
      );
      for (let i = 0; i < products.length; i++) {
        imagePaths.push(products[i].mainImage);
        imagePaths.push(...products[i].subImages);
      }
      for (let i = 0; i < imagePaths.length; i++) {
        deleteFile(imagePaths[i]);
      }
      return res.status(200).json({
          message: messages.subcategory.deletedSuccessfully,
          success: true,
        });
    }