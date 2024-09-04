// import modules:
import { User } from "../../db/models/user.model.js";
import { AppError } from "../utils/appError.js";
import { messages } from "../utils/constant/messages.js";
import { verifyToken } from "../utils/token.js";
// authentication middleware:
export const isAuthenticated = () => {
  return async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return next(new AppError("token is required in this case", 401));
    }
    let payload = null
    try {
      payload = verifyToken({ token });
    } catch (error) {
      return next(new AppError(error.message, 500))
    }
    if(!payload?._id){
     return next(new AppError('Invalid Payload', 401))
    }
    const user = await User.findById(payload._id);
    if (!user) {
      return next(new AppError(messages.user.notFound, 401));
    }
    req.authUser = user;
    next();
  };
};

// authorization middleware:
export const isAuthorized = (roles = []) => {
  return async (req, res, next) => {
    const user = req.authUser
    if (!roles.includes(user.role)) {
      return next(new AppError('not authorized', 401))
  }
  next()
}
}
