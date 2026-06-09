import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

export const profileImageUploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLocaleLowerCase();

    const validMime = allowedMimeTypes.includes(file.mimetype);
    const validExt = allowedExtensions.includes(extension);

    if (!validMime || !validExt) {
      return cb(new Error("Only JPG, JPEG, PNG and WEBP are allowed"));
    }

    cb(null, true);
  },
}).single("profileImage");
