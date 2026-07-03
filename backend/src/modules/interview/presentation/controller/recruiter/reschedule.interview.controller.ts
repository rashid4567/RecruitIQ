import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  RescheduleInterviewRequestDTO,
  RescheduleInterviewResponseDTO,
} from "../../../application/dto/rescheduleInterview.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { RescheduleInterviewSchema } from "../../validation/Reschedule.interview.schema";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class RescheduleInterviewController {
  constructor(
    private readonly _rescheduleInterviewUC: IUseCase<
      RescheduleInterviewRequestDTO,
      RescheduleInterviewResponseDTO
    >,
  ) {}

  reschedule = async (req: Request, res: Response, next: NextFunction) => {
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

      const validateData = RescheduleInterviewSchema.parse(req.body);

      const result = await this._rescheduleInterviewUC.execute({
        interviewId,
        recruiterId,
        scheduledAt: validateData.scheduledAt,
        durationInMinutes: validateData.durationInMinutes,
        meetingLink: validateData.meetingLink,
        roomId: validateData.roomId,
        location: validateData.location,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.INTERVIEW_RESCHEDULED_SUCCESSFULLY,
        result,
      );
    } catch (err) {
      next(err);
    }
  };
}
