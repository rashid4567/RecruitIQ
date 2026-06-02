import multer from "multer";
import path from "path";
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const allowedExtensions = [".pdf", ".doc", ".docx"];
export const resumeUploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const isValidMime = allowedMimeTypes.includes(file.mimetype);
    const isValidExtension = allowedExtensions.includes(extension);
    if (!isValidMime || !isValidExtension) {
      return cb(new Error("Only PDF, DOC and DOCX files are allowed"));
    }
    cb(null, true);
  },
}).single("resume");
