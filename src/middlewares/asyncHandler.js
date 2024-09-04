// import app error:
import { AppError } from "../utils/appError.js";
// create async handler to handle error:
export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    fn(req, res, next).catch((err) => {
      return next(new AppError(err.message, err.statusCode));
    });
  };
};
