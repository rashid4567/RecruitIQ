import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  RejectRescheduleRequestDTO,
  RejectRescheduleResponseDTO,
} from "../../../application/dto/reject-reschedule-request.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class RejectRescheduleReqestController {
  constructor(
    private readonly rejectRescheduleRequestUC: IUseCase<
      RejectRescheduleRequestDTO,
      RejectRescheduleResponseDTO
    >,
  ) {}

  rejectRequest = async (req: Request, res: Response, next: NextFunction) => {
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
      const response = await this.rejectRescheduleRequestUC.execute({
        interviewId,
        recruiterId,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.RESCHEDULED_REQUEST_REJECTED_SUCCESSFULLY,
        response,
      );
    } catch (err) {
      next(err);
    }
  };
}
