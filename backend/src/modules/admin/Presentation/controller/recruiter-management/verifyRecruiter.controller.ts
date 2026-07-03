import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { VerifyRecruiterRequestDTO } from "../../../Application/dto/recruiter.dto/recruiter.status.dto";

export class VerifyRecruiterController {
  constructor(
    private readonly _verifyRecruiterUC: IUseCase<
      VerifyRecruiterRequestDTO,
      void
    >,
  ) {}

  verifyRecruiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recruiterId } = req.params;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      await this._verifyRecruiterUC.execute({ recruiterId });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.RECRUITER_VERIFIED_SUCCESSFULLY,
      });
    } catch (err) {
      return next(err);
    }
  };
}
