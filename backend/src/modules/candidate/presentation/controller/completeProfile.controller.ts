import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { userIdSchema } from "../validator/userId.validatort";
import { completeCandidateProfileSchema } from "../validator/completeCandidateProfile-validator";
import { ERROR_MESSAGE } from "../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { CompleteCandidateProfileRequestDTO } from "../../application/dto/complete-candidate-profile.dto";

export class CandidateController {
  constructor(
    private readonly completeProfileUC: IUseCase<
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
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.MISSING_FILEDS,
        });
      }
      const profile = await this.completeProfileUC.execute({
        userId,
        profile: body,
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
