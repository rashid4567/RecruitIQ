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
      console.log("req :", req.body);
     const parsedBody = ScheduleInterviewSchema.parse(req.body);
     console.log("After parse :", parsedBody);
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
