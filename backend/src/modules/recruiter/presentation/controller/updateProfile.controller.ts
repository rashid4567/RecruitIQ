import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { userIdSchema } from "../validator/userId.validator";
import { UpdateRecruiterProfileSchema } from "../validator/updateRecruiterProfile-validator";
import { UpdateRecruiterProfileUseCase } from "../../application/useCase/profile/update-recruiter-profile.usecase";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { UpdateRecruiterProfileRequestDTO } from "../../application/dto/update-recruiter-profile.dto";
import { RecruiterProfileReponse } from "../../application/dto/recruiter-profile.dto";

export class UpdateRecruiterProfileController {
  constructor(
    private readonly updateProfileUC: UseCase<
      UpdateRecruiterProfileRequestDTO,
      RecruiterProfileReponse
    >,
  ) {}

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);

      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const body = UpdateRecruiterProfileSchema.parse(req.body);

      if (!body) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.MISSING_FILEDS,
        });
      }
      const profile = await this.updateProfileUC.execute({
        userId,
        input: body,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };
}
