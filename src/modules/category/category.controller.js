// import modules:
import slugify from "slugify";
import { Category } from "../../../db/models/category.model.js";
import { AppError } from "../../utils/appError.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { messages } from "../../utils/constant/messages.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { subCategory } from "../../../db/models/subCategory.model.js";
import { Product } from "../../../db/models/product.model.js";
import cloudinary from "../../utils/cloudinary.js";
// add a category:
export const addCategory = async (req, res, next)=>{
    // get data from req:
    let {name, slug, image, createdBy} = req.body;
    name = name.toLowerCase();
    // check category existence:
    let category = await Category.findOne({name});
    if(category){
        // delete image:
        req.failImage = req.file.path
     return next(new AppError(messages.category.alreadyExist, 409))
    }
    // check image existence:
    if(!req.file){
        return next(new AppError('Image is required', 404))
    }
    // create slug:
   slug = slugify(name, {
      replacement: "_",
      lower: true,
    }); 
    image = req.file.filename
    // prepare category:
     category =  new Category({
      name, 
      slug,
      image,
      createdBy:req.authUser._id
     })
    // add category to db:
    const createdCategory = await category.save();
    // fail to create:
    if(!createdCategory){
        // delete image:
         req.failImage = req.file.path;
        return next(new AppError(messages.category.failToCreate, 500))
    }
    // send response:
    return res.status(201).json({message:messages.category.createdSuccessfully,
         data:createdCategory, 
         success:true})

}
// get all categories:
export const getAllCategories = async (req, res, next)=>{
   const apiFeature = new ApiFeature(Category.find().populate('subCategory'), req.query).pagination().sort().select().filter();
   const categories = await apiFeature.mongooseQuery;
   return res.status(200).json({ success: true, data: categories });
}
// get a specific category:
export const getSpecificCategory = async (req, res, next)=>{
    const {id} = req.params;
    const specificCategory = await Category.findById(id).populate('subCategory')
     specificCategory || next(new AppError(messages.category.notFound, 404));
    !specificCategory || res.status(200).json({success:true, data: specificCategory})
}
// update a category:
export const updateCategory = async(req, res, next)=>{
    const {id} = req.params;
    let {name, slug, image}= req.body
   
    const categoryExist = await Category.findById(id)
    if(!categoryExist){
        return next(new AppError(messages.category.notFound), 404)
    }
     if (req.file) {
        // delete old image
        deleteFile(categoryExist.image)
        // update new image
        categoryExist.image = req.file.filename
    };
    if(name){
        categoryExist.name = name;
        categoryExist.slug = slugify(name)
    }
  const updatedCategory = await categoryExist.save()
  if(!updatedCategory){
     req.failImage = req.file.path;
    return next(new AppError(messages.category.failToUpdate), 500)
  }
   return res.status(200).json({message: messages.category.updatedSuccessfully, data: updatedCategory , success:true})
}
// delete a category:
export const deleteCategory = async (req, res, next) => {
  const { categoryId} = req.params;
//   check category existence
  const categoryExist =await Category.findByIdAndDelete(categoryId);
  if(!categoryExist){
    return next(new AppError(messages.category.notFound), 404)
  }
//   prepare ids:
  const sub_categories = await subCategory.find({category: categoryId}).select('image')
  const products = await Product.find({ category: categoryId }).select('mainImage subImages');
  const sub_categoriesIds = sub_categories.map(sub_category => sub_category._id)
  const productsIds = products.map(product => product._id)
//   delete subcategories and products:
  await subCategory.deleteMany({_id : {$in: sub_categoriesIds}})
  await Product.deleteMany({ _id: { $in: productsIds } });
//  delete images:
 const imagePaths = sub_categories.map(sub_category => sub_category.image)
 for (let i = 0; i < products.length; i++) {
    imagePaths.push(products[i].mainImage)
    imagePaths.push(...products[i].subImages);

 }
 for (let i = 0; i < imagePaths.length; i++) {
    deleteFile(imagePaths[i])
 }
  return res.status(200).json({message:messages.category.deletedSuccessfully, success:true})
};

/*************************************************************************/ 
// add category using cloudinary:
export const addCloudCategory = async (req, res, next) => {
  // get data from req:
    let {name, slug, image, createdBy} = req.body;
    name = name.toLowerCase();
    // check category existence:
    let category = await Category.findOne({name});
    if(category){
        // delete image:
      
     return next(new AppError(messages.category.alreadyExist, 409))
    }
    // check image existence:
    if(!req.file){
        return next(new AppError('Image is required', 404))
    }
    // create slug:
   slug = slugify(name, {
      replacement: "_",
      lower: true,
    }); 
   const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path , {
      folder: 'e_commerce/category'
    })
    image = {secure_url , public_id}
    // prepare category:
     category =  new Category({
      name, 
      slug,
      image,
      // createdBy:req.authUser._id
     })
    // add category to db:
    const createdCategory = await category.save();
    // fail to create:
    if(!createdCategory){
        // delete image:
        return next(new AppError(messages.category.failToCreate, 500))
    }
    // send response:
    return res.status(201).json({message:messages.category.createdSuccessfully,
         data:createdCategory, 
         success:true})
};
// delete category using cloudinary:
export const deleteCloudCategory = async (req, res, next) => {
   const { categoryId } = req.params;
   //   check category existence
   const categoryExist = await Category.findByIdAndDelete(categoryId);
  //  if (!categoryExist) {
  //    return next(new AppError(messages.category.notFound), 404);
  //  }
   //   prepare ids:
   const sub_categories = await subCategory.find({ category: categoryId }).select("image");
   const products = await Product.find({ category: categoryId }).select( "mainImage subImages");
   let imagePaths = []
   const sub_categoriesIds = []
    sub_categories.forEach(sub_category =>{
    imagePaths.push(sub_category.image)
     sub_categoriesIds.push(sub_category._id)
   });
   const productsIds = [] 
   products.forEach(product => {
     imagePaths.push(product.mainImage)
     imagePaths.push(...product.subImages)
     productsIds.push(product._id)
   });
   //   delete subcategories and products:
   await subCategory.deleteMany({ _id: { $in: sub_categoriesIds } });
   await Product.deleteMany({ _id: { $in: productsIds } });
   for (let i = 0; i < imagePaths.length; i++) {
    if(typeof(imagePaths[i] === "string")){
      deleteFile(imagePaths[i])
    }
    else{
     await cloudinary.uploader.destroy(imagePaths[i].public_id);
    }
    
   }
   return res.status(200).json({ message: messages.category.deletedSuccessfully, success: true });
}
//  update category using cloudinary:
 export const updateCloudCategory = async (req, res, next) => {
     const { categoryId } = req.params;
     const category = await Category.findById(categoryId);
     if(req.file){
     const {secure_url, public_id} = await  cloudinary.uploader.upload(req.file.path , {
        public_id :category.image.public_id
      })
      req.body.image = {secure_url, public_id}
     }
    category.image = req.body.image || category.image;
    category.name = req.body.name || category.name
   const updated_category =  await category.save()
    return res.status(200).json({message: messages.category.updatedSuccessfully, success: true, data: updated_category })
 }