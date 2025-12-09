import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
});
