import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { CompleteCandidateProfileUseCase } from "../../application/use-cases/profile/complete-candidate-profile.usecase";
import { userIdSchema } from "../validator/userId.validatort";
import { completeCandidateProfileSchema } from "../validator/completeCandidateProfile-validator";
import { ERROR_MESSAGE } from "../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../constants/success-message.constants";

export class CandidateController {
  constructor(
    private readonly completeProfileUC: CompleteCandidateProfileUseCase,
  ) {}

  completeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = userIdSchema.parse(req.user?.userId);

      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED
        });
      }
      const body = completeCandidateProfileSchema.parse(req.body);

      if (!body) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.MISSING_FILEDS
        });
      }
      const profile = await this.completeProfileUC.execute(userId, body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PROFILE_COMPLETED_SUCCESFULLY, 
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  };
}
