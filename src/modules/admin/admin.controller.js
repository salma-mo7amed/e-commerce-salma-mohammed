// import modules:
import { Cart } from "../../../db/index.js";
import { User } from "../../../db/models/user.model.js";
import { AppError } from "../../utils/appError.js";
import cloudinary from "../../utils/cloudinary.js";
import { messages } from "../../utils/constant/messages.js";
import { status } from "../../utils/constant/role-identification.js";
import { hashPassword } from "../../utils/password-role.js";
/************************crud operations**********************/
// add a user api:
export const addUser = async (req, res, next) => {
  //  get data from req:
  let{ userName, email, role, phone, password } = req.body;
  // check existence
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new AppError(messages.user.alreadyExist, 409));
  }
  // upload image on cloudinary:
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "users" }
    );
    req.body.image = { secure_url, public_id };
  }
  password= "new_user"
   password = hashPassword({ password });
  // prepare user:
  const user =  new User({
    userName,
    email,
    role,
    phone,
    status: status.VERIFIED,
    image: req.body.image,
    password,
  });
   await Cart.create({ user: user._id, products: [] });
  const createdUser = await user.save()
  if (!createdUser) {
    return next(new AppError(messages.user.failToCreate, 500));
  }
  return res
    .status(201)
    .json({
      message: messages.user.createdSuccessfully,
      success: true,
      data: createdUser,
    });
};
// get all users:
export const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  return res.status(200).json({ success: true, data: users });
};
// get specific user
export const getSpecificUser = async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError(messages.user.notFound, 404));
  }
  return res.status(200).json({ success: true, data: user });
};
// update user
export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: user.image.public_id,
      }
    );
    req.body.image = { secure_url, public_id };
  }
  user.image = req.body.image || user.image;
  user.userName = req.body.userName || user.userName;
  user.email = req.body.email || user.email;
  user.password = req.body.password || user.password;
  user.role = req.body.role || user.role;
  user.phone = req.body.phone || user.phone;
  const updated_user = await user.save();
  return res
    .status(200)
    .json({
      message: messages.user.updatedSuccessfully,
      success: true,
      data: updated_user,
    });
};
//  delete user
export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  //   check category existence
  const userExist = await User.findByIdAndDelete(userId);
  if (!userExist) {
    return next(new AppError(messages.user.notFound), 404);
  }
  //    delete image
  await cloudinary.uploader.destroy(userExist.image.public_id);
  return res
    .status(200)
    .json({ message: messages.user.deletedSuccessfully, success: true });
};
