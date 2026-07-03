import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { profileImageSchema } from "../validators/profile-image.schema";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { UpdateProfileImageRequest } from "../../application/dto/update.profileDTO";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class ProfileImageController {
  constructor(
    private readonly _updateProfileImageUC: IUseCase<
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
      if (!file) {
        ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.MISSING_FIELDS,
        );
        return;
      }

      profileImageSchema.parse({
        mimetype: file.mimetype,
        size: file.size,
      });

      await this._updateProfileImageUC.execute({
        userId,
        file,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PROFILE_IMAGE_UPDATED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  };
}
