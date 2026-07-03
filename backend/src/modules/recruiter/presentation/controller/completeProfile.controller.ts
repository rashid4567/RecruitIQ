import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { userIdSchema } from "../validator/userId.validator";
import { CompleteRecruiterProfileSchema } from "../validator/completeRecruiterProfile-validator";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { CompleteRecruiterProfileRequestDTO } from "../../application/dto/complete-recruiter-profile.dto";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class CompleteRecruiterProfileController {
  constructor(
    private readonly _completeProfileUC: IUseCase<
      CompleteRecruiterProfileRequestDTO,
      void
    >,
  ) {}

  completeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);
      const body = CompleteRecruiterProfileSchema.parse(req.body);

      if (!userId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const profile = await this._completeProfileUC.execute({
        userId,
        data: body,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PROFILE_COMPLETED_SUCCESSFULLY,
        profile,
      )
    } catch (err) {
      next(err);
    }
  };
}
