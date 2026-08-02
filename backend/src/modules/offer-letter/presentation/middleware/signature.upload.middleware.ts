import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const allowedExtensions = [
  ".png",
  ".jpg",
  ".jpeg",
];

export const signatureUploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, 
  },

  fileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();

    const isValidMime = allowedMimeTypes.includes(file.mimetype);
    const isValidExtension = allowedExtensions.includes(extension);

    if (!isValidMime || !isValidExtension) {
      return cb(
        new Error("Only PNG, JPG and JPEG signature images are allowed"),
      );
    }

    cb(null, true);
  },
}).single("signature");