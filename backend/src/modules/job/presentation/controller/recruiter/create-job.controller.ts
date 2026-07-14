import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { CreateJobSchema } from "../../validator/create.jobpost.validation";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { createJobPostRequestDTO } from "../../../application/dto/create-job.dto";
import { Job } from "../../../domain/entities/job.entity";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class CreateJobController {
  constructor(
    private readonly _createUc: IUseCase<createJobPostRequestDTO, Job>,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const dto = CreateJobSchema.parse(req.body);
      const job = await this._createUc.execute({ recruiterId, dto });
      ApiResponse.success(
        res,
        HTTP_STATUS.CREATED,
        SUCCESS_MESSAGES.JOB_CREATED_SUCCESSFULLY,
        job,
      );
    } catch (err) {
      next(err);
    }
  };
}
