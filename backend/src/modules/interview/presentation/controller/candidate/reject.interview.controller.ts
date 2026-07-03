import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  RejectInterviewRequestDTO,
  RejectInterviewResponseDTO,
} from "../../../application/dto/reject-interview.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { RejectInterviewSchema } from "../../validation/reject-interview.schema";

export class RejectInterviewController {
  constructor(
    private readonly _rejectInterviewUC: IUseCase<
      RejectInterviewRequestDTO,
      RejectInterviewResponseDTO
    >,
  ) {}

  reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const { interviewId } = req.params;
      if (!interviewId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.INTERVIEW_REQUIRED,
        );
      }

      const parsedBody = RejectInterviewSchema.parse(req.body);
      const result = await this._rejectInterviewUC.execute({
        interviewId,
        candidateId,
        reason: parsedBody.reason,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.INTERVIEW_REJECTED_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
