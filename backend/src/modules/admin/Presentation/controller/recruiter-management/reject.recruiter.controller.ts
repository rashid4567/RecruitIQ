import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { RejectRecruiterUseCase } from "../../../Application/use-Cases/recruiter-management/reject-recruiter.usecase";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class RejectRecruiterController {
  constructor(private readonly rejectRecruiterUC: RejectRecruiterUseCase) {}

  rejectRecruiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recruiterId } =  req.params;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      await this.rejectRecruiterUC.execute(recruiterId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.CANDIDATE_REJECTED_SUCCESFULLY,
      });
    } catch (err) {
      return next(err);
    }
  };
}
