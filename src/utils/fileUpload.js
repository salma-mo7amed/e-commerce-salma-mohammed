// import modules:
import multer from "multer";
import { nanoid } from "nanoid";
import { AppError } from "./appError.js";
// create fileUpload function:

const fileUpload = (folderName) => {
  const storage = multer.diskStorage({
    destination: `uploads/${folderName}`,
    filename: (req, file, cb) => {
      cb(null, nanoid() + "_" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("you entered inavild file format", 401), false);
    }
  };
  const upload = multer({ storage, fileFilter });
  return upload;
};
export const uploadSingleFile = (fieldName, folderName) =>
  fileUpload(folderName).single(fieldName);
export const uploadMixedFiles = (arrayOfFields, folderName) =>
  fileUpload(folderName).fields(arrayOfFields);
