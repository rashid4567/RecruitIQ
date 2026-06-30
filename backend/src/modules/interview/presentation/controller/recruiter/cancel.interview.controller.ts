import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  CancelInterviewRequestDTO,
  CancelInterviewResponseDTO,
} from "../../../application/dto/cancel-interview.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { CancelInterviewSchema } from "../../validation/cancel.inerview.schema";

export class CancelInterviewController {
  constructor(
    private readonly cancelInterviewUC: IUseCase<
      CancelInterviewRequestDTO,
      CancelInterviewResponseDTO
    >,
  ) {}

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
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

      const { reason } = CancelInterviewSchema.parse(req.body);
      if (!reason) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.MISSING_FIELDS,
        );
      }

      const result = await this.cancelInterviewUC.execute({
        interviewId,
        recruiterId,
        reason,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.INTERVIEW_CANCELLED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
