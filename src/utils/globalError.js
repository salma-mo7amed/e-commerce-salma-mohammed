import { deleteFile } from "./deleteFile.js";

// function to handle any global error:
export const globalError = (err, req, res, next) => {
  if(req.failImage){
    deleteFile(req.failImage)
  }
  return res.status(err.statusCode || 500).json({ message: err.message, success: false });
};
