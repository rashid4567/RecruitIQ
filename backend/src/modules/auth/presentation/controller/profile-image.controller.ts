import { Request, Response, NextFunction } from "express";
import { UpdateProfileImageUseCase } from "../../application/useCase/update-profile-image.usecase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { profileImageSchema } from "../validators/profile-image.schema";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";

export class ProfileImageController {
  constructor(
    private readonly updateProfileImageUC: UpdateProfileImageUseCase,
  ) {}

  updateProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
        return;
      }

      const file = req.file;
      console.log(req.file);
      if (!file) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: SUCCESS_MESSAGES.FILE_IS_REQUIRED,
        });
        return;
      }

      profileImageSchema.parse({
        mimetype: file.mimetype,
        size: file.size,
      });

      await this.updateProfileImageUC.execute({
        userId,
        file,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PROFILE_IMAGE_UPDATED_SUCCESFULLY,
      });
    } catch (error) {
      next(error);
    }
  };
}
