import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { GetRecruiterProfileUseCase } from "../../application/useCase/profile/get-recruiter-profile.usecase";
import { userIdSchema } from "../validator/userId.validator";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import {
  GetRecruiterProfileRequestDTO,
  RecruiterProfileReponse,
} from "../../application/dto/recruiter-profile.dto";

export class GetRecruiterProfileController {
  constructor(
    private readonly getProfileUC: UseCase<
      GetRecruiterProfileRequestDTO,
      RecruiterProfileReponse
    >,
  ) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      const profile = await this.getProfileUC.execute({ userId });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.RECRUITER_PROFILE_LOADED_SUCCESSFULLY,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };
}
