import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { VerifyRecruiterUseCase } from "../../../Application/use-Cases/recruiter-management/verify-recruiter.usecase";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class VerifyRecruiterController {
  constructor(private readonly verifyRecruiterUC: VerifyRecruiterUseCase) {}

  verifyRecruiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recruiterId } = req.params;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      await this.verifyRecruiterUC.execute(recruiterId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.RECRUITER_VERIFIED_SUCCESFULLY,
      });
    } catch (err) {
      return next(err);
    }
  };
}
