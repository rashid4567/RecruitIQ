import { Router } from "express";
import { profileImageUploadMiddleware } from "../middlewares/profile-image-upload.middleware";
import { profileImageController } from "../container/auth.container";
import { AUTH_ROUTES } from "../constants/auth-routes.constants";

const router = Router();

router.patch(
  AUTH_ROUTES.PROFILE_IMAGE,
  profileImageUploadMiddleware,
  profileImageController.updateProfileImage,
);

export default router;
