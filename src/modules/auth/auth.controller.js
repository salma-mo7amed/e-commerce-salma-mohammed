// import modules:
import { Cart } from "../../../db/index.js";
import { User } from "../../../db/models/user.model.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { status } from "../../utils/constant/role-identification.js";
import { generatedOTP } from "../../utils/generateOTP.js";
import { comparePassword, hashPassword } from "../../utils/password-role.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { generateToken, verifyToken } from "../../utils/token.js";

// sign up function:
export const signup = async (req, res, next) => {
  // get data from req
  let { userName, email, password, phone, image, DOB } = req.body;
  // check existence:
  const userExist = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExist) {
    return next(new AppError(messages.user.alreadyExist, 409));
  }
  // hashing password:
  password = hashPassword({ password });
  // prepare user
  const user = new User({
    userName,
    email,
    password,
    phone,
  });
  // add to db:
  const createdUser = await user.save();
  // fail to create:
  if (!createdUser) {
    return next(new AppError(messages.user.failToCreate, 500));
  }
  //send email:
  const token = generateToken({ payload: { _id: createdUser._id } });
  await sendEmail({
    to: email,
    subject: "verify your account",
    html: `<p>account verification link 
    <a href='${req.protocol}://${req.headers.host}/auth/verify-account?token=${token}'>link</a>
    </p>`,
  });
  // send response:
  return res.status(201).json({
    message: messages.user.createdSuccessfully,
    sucess: true,
    data: createdUser,
  });
};
// verify account function:
export const verifyAccount = async (req, res, next)=>{
  // get data from req:
  const {token}= req.query;
  const decoded = verifyToken({token})
  const user = await User.findByIdAndUpdate(decoded._id, {status:status.VERIFIED}, {new:true})
  if(!user){
    return next(new AppError(messages.user.notFound, 404))
  
  }
  await Cart.create({user: user._id, products:[]})
  return res.status(200).json({message:messages.user.verifiedAccount, success:true})
}
// login function:
export const logIn = async(req, res, next)=>{
  // get data from req:
  const {email, phone, password} = req.body;
  // check user existence:
  const isUserExist = await User.findOne({$or:[{email}, {phone}], status: status.VERIFIED})
  if(!isUserExist){
    return next(new AppError(messages.password.invalidCredential, 401))
  }
  // check password:
  const isMatch = comparePassword({password, hashPassword:isUserExist.password})
  if(!isMatch){
    return next(new AppError(messages.password.invalidCredential, 401))
  }
  isUserExist.isActive = true;
  await isUserExist.save()
  const accessedToken = generateToken({payload:{_id:isUserExist._id}})
  return res.status(200).json({message:'your login is done successfully', success:true, accessedToken})
}
//  forget user password function:
export const forgetUserPassword = async (req, res, next) => {
  // get data from req:
  let { email } = req.body;
  //  check user existence in our system:
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return next(new AppError(messages.user.notFound, 404));
  }
  // if user has an email with an otp:
  if (userExist.otp && userExist.otpExpireDate > Date.now()) {
    return next(
      new AppError("you already have an otp...check your email", 400)
    );
  }
  // generate one time password (OTP) to send email using it to the user:
  const OTP = generatedOTP();
  // save this otp for the user model to be able to check first:
  userExist.otp = OTP;
  userExist.otpExpireDate = Date.now() + 15 * 60 * 1000;
  //  save to db:
  await userExist.save();
  // send email to the user with the otp to make sure that this was his/ her email and to be able to reset password:
  await sendEmail({
    to: email,
    subject: "otp verification",
    html: `<h3>your otp ${OTP} as you forget your account password, you have to use it to be able to reset your password\n 
    if you did not request for this ignore this email</h3>`,
  });
  // send response:
  res
    .status(200)
    .json({ message: "check your email to get your otp", success: true });
};
// change user password function:
export const changeUserPassword = async (req, res, next) => {
  // get data from req:
  let { otp, email , newPassword } = req.body;
  // check email existence:
  const user = await User.findOne({email})
  if(!user){
    return next(new AppError(messages.user.notFound, 404))
  }
  // check otp:
  if(user.otp != otp){
    return next(new AppError('Invalid OTP', 401))
  }
  // check otp expire:
  if(user.otpExpireDate < Date.now()){
    // generate a new otp:
    let OTP = generatedOTP();
    user.otp = OTP;
    user.otpExpireDate = Date.now() + 5 * 60 * 1000;
    // save to db:
    await user.save();
    // send another email:
    await sendEmail({to:email, subject:'Resending new OTP...', html:`<h4>your new OTP is ${OTP}</h4>`})
    // send response:
    return res.status(200).json({message:'check your email', success: true})

  }
  // hash new password:
  const hashingPassword = hashPassword({password:newPassword}) 
  await user.updateOne({email}, {password:hashingPassword, $unset:{otp: "", otpExpireDate:""}});
  // send response:
  return res.status(200).json({message: messages.password.updatedSuccessfully, success:true})
};
