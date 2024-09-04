// import modules:

import { User } from "../../../db/models/user.model.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { comparePassword, hashPassword } from "../../utils/password-role.js";


// get logged user:
export const getLoggedUser= async(req, res, next)=>{
    let user = await User.findOne({ _id: req.authUser._id })
    if (!user) {
      return next(new AppError(messages.user.notFound, 404));
    }
    return res.status(200).json({ success: true, data: user });
}
// update user: 
export const updateUser = async (req, res, next)=>{
  let {userId} = req.params
  req.authUser._id = userId
  const updatedUser = await User.findByIdAndUpdate(userId,req.body, {new:true})
  if(!updatedUser){
   return next(new AppError(messages.user.failToUpdate, 500))
  }
  return res.status(200).json({message:messages.user.updatedSuccessfully, success: true, data:updatedUser})
}
// delete user: 
export const deleteUser = async (req, res, next)=>{
  let {userId} = req.params
  req.authUser._id = userId
  const deletedUser = await User.findByIdAndDelete(userId)
  if(!deletedUser){
   return next(new AppError(messages.user.notFound, 404))
  }
  return res.status(200).json({message:messages.user.deletedSuccessfully, success: true})
}


// reset password Api:
export const resetUserPassword = async (req, res, next) => {
  // get data from req
  let { oldPassword, newPassword } = req.body;
  let userId = req.authUser._id;
  // check on the old password of the user and compare it with the password I have:
  const matchedPassword = comparePassword({
    password: oldPassword,
    hashPassword: req.authUser.password,
  });
  if (!matchedPassword) {
    return next(new AppError(messages.password.invalidCredential, 401));
  }
  //  hashing the password:
  const hashingPassword = hashPassword({ password: newPassword });
  // update user password with the new one:
  const updatedUser = await User.updateOne(
    { _id: userId },
    { password: hashingPassword }
  );
  //send response:
  return res.status(201).json({message:messages.user.updatedSuccessfully, success:true})
};
