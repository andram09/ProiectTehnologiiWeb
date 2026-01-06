import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import dotenv from "dotenv";
dotenv.config();
//configurare cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Numele folderului din Cloudinary
    // format: async (req, file) => "pdf",
    resource_type: "auto",
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `file-${uniqueSuffix}`;
    },
  },
});
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); //acceptam fisierul
  } else {
    cb(new Error("Doar fisierele pdf sunt acceptate"), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
});
