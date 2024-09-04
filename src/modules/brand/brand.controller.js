// import modules:

import slugify from "slugify";
import { Brand } from "../../../db/models/brand.model.js";
import { AppError } from "../../utils/appError.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { messages } from "../../utils/constant/messages.js";
import { deleteFile } from "../../utils/deleteFile.js";

// add a brand:
export const addBrand = async (req, res, next)=>{
  // get data from req:
  let { name, slug, logo, createdBy } = req.body;
  name = name.toLowerCase()
  // check brand existence:
  let brand = await Brand.findOne({ name });
  if (brand) {
    // remove logo
     req.failImage = req.file.path; 
    return next(new AppError(messages.brand.alreadyExist, 409));
  }
  // check logo existence:
  if (!req.file) {
    return next(new AppError("logo is required", 404));
  }
  // create slug:
  slug = slugify(name, {
    replacement: "_",
    lower: true,
  });
  logo = req.file.filename;
  // prepare category:
  brand = new Brand({
    name,
    slug,
    logo,
    createdBy:req.authUser._id
  });
  // add brand to db:
  const createdBrand = await brand.save();
  // fail to create:
  if(!createdBrand){
    // remove image
     req.failImage = req.file.path; 
    return next(new AppError(messages.brand.failToCreate, 500))
  }
  // send response:
  return res.status(201).json({ message: messages.brand.createdSuccessfully, 
    data: createdBrand, 
    success: true,});
}
// get all Brands 
export const getAllBrands = async(req, res, next)=>{
  const apiFeature = new ApiFeature(Brand.find().populate('createdBy'), req.body).pagination().sort().select().filter()
   let brands = await apiFeature.mongooseQuery;
   return res.status(200).json({ success: true, data: brands });
}
// get a specific Brand
export const getSpecificBrand = async (req, res, next) => {
  const { id } = req.params;
  const specificBrand = await Brand.findById(id);
  specificBrand || next(new AppError(messages.brand.notFound, 404));
  !specificBrand|| res.status(200).json({ success: true, data: specificBrand });
};
// update Brand
export const updateBrand = async (req, res, next) => {
 const { id } = req.params;
 let { name, slug, logo } = req.body;
 const brandExist = await Brand.findById(id);
 if (!brandExist) {
   return next(new AppError(messages.brand.notFound), 404);
 }
 if (req.file) {
   // delete old image
   deleteFile(brandExist.logo);
   // update new image
   brandExist.logo = req.file.filename;
 }
 if (name) {
   brandExist.name = name;
   brandExist.slug = slugify(name);
 }
 const updatedBrand = await brandExist.save();
 if (!updatedBrand) {
   req.failImage = req.file.path;
   return next(new AppError(messages.brand.failToUpdate), 500);
 }
 return res
   .status(200)
   .json({
     message: messages.brand.updatedSuccessfully,
     data: updatedBrand,
     success: true,
   });
};
// delete Brand
export const deleteBrand = async (req, res, next) => {
 const { id } = req.params;
 const brand = await Brand.findByIdAndDelete(id);
  const thisBrand = await Brand.findById(id)
 if(thisBrand){
  deleteFile(thisBrand.logo)
 }
 brand || next(new AppError(messages.brand.notFound, 404));
 !brand || res.status(200).json({ message: messages.brand.deletedSuccessfully, success: true });
};