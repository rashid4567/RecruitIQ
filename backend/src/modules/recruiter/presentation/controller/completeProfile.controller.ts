import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { userIdSchema } from "../validator/userId.validator";
import { CompleteRecruiterProfileSchema } from "../validator/completeRecruiterProfile-validator";
import { CompleteRecruiterProfileUseCase } from "../../application/useCase/profile/complete-recruiter-profile.usecase";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { CompleteRecruiterProfileRequestDTO } from "../../application/dto/complete-recruiter-profile.dto";

export class CompleteRecruiterProfileController {
  constructor(
    private readonly completeProfileUC: UseCase<
      CompleteRecruiterProfileRequestDTO,
      void
    >,
  ) {}

  completeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      const body = CompleteRecruiterProfileSchema.parse(req.body);

      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const profile = await this.completeProfileUC.execute({
        userId,
        data: body,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PROFILE_COMPLETED_SUCCESSFULLY,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };
}
