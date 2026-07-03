import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { userIdSchema } from "../validator/userId.validatort";
import { completeCandidateProfileSchema } from "../validator/completeCandidateProfile-validator";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { CompleteCandidateProfileRequestDTO } from "../../application/dto/complete-candidate-profile.dto";
import { ApiResponse } from "../../../../shared/utils/api-response";

export class CandidateController {
  constructor(
    private readonly _completeProfileUC: IUseCase<
      CompleteCandidateProfileRequestDTO,
      void
    >,
  ) {}

  completeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);

      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      const body = completeCandidateProfileSchema.parse(req.body);

      if (!body) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.MISSING_FIELDS,
        );
      }
      const profile = await this._completeProfileUC.execute({
        userId,
        profile: body,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.PROFILE_COMPLETED_SUCCESSFULLY,
        profile,
      );
    } catch (err) {
      next(err);
    }
  };
}
