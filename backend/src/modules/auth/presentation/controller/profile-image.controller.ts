import { Request, Response, NextFunction } from "express";
import { UpdateProfileImageUseCase } from "../../application/useCase/update-profile-image.usecase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { profileImageSchema } from "../validators/profile-image.schema";

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
          message: "Unauthorized",
        });
        return;
      }

      const file = req.file;
      console.log(req.file);
      if (!file) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "File is required",
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
        message: "Profile image updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
