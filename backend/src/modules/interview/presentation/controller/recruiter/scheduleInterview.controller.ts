import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  ScheduleInterviewRequestDTO,
  ScheduleInterviewResponseDTO,
} from "../../../application/dto/schedule.interview.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { ScheduleInterviewSchema } from "../../validation/schedule.interview.schema";

export class ScheduleInterviewController {
  constructor(
    private readonly scheduleInterviewUC: IUseCase<
      ScheduleInterviewRequestDTO,
      ScheduleInterviewResponseDTO
    >,
  ) {}

  scheduleInterview = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const parsedBody = ScheduleInterviewSchema.parse({
        applicationId: req.params.applicationId,
        round: req.body.round,
        title: req.body.title,
        description: req.body.description,
        mode: req.body.mode,
        scheduledAt: req.body.scheduledAt,
        durationInMinutes: req.body.durationInMinutes,
        location: req.body.location,
      });
      const input: ScheduleInterviewRequestDTO = {
        ...parsedBody,
        recruiterId,
      };

      const result = await this.scheduleInterviewUC.execute(input);
      return ApiResponse.success(
        res,
        HTTP_STATUS.CREATED,
        SUCCESS_MESSAGES.INTERVIEW_SCHEDULED_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  };
}
