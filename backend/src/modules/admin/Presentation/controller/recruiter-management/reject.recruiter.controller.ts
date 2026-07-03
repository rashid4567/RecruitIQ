import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { rejectRecruiterRequestDTO } from "../../../Application/dto/recruiter.dto/recruiter.status.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class RejectRecruiterController {
  constructor(
    private readonly _rejectRecruiterUC: IUseCase<
      rejectRecruiterRequestDTO,
      void
    >,
  ) {}

  rejectRecruiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { recruiterId } = req.params;

      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }
      await this._rejectRecruiterUC.execute({ recruiterId });
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.CANDIDATE_REJECTED_SUCCESSFULLY,
      );
    } catch (err) {
      return next(err);
    }
  };
}
