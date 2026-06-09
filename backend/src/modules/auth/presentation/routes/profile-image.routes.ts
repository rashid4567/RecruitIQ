import { Router } from "express";
import { profileImageUploadMiddleware } from "../middlewares/profile-image-upload.middleware";
import { profileImageController } from "../container/auth.container";

const router = Router();

router.patch("/profile-image",profileImageUploadMiddleware,profileImageController.updateProfileImage)


export default router;
