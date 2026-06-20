import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { profileImageSchema } from "../validators/profile-image.schema";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { UpdateProfileImageRequest } from "../../application/dto/update.profileDTO";

export class ProfileImageController {
  constructor(
    private readonly updateProfileImageUC: UseCase<
      UpdateProfileImageRequest,
      void
    >,
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
        message: SUCCESS_MESSAGES.PROFILE_IMAGE_UPDATED_SUCCESSFULLY,
      });
    } catch (error) {
      next(error);
    }
  };
}
