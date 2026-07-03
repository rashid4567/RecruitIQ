import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { applyJobSchema } from "../../validator/apply-job.validator";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ApplyJobDTO } from "../../../application/dto/applyJobDto";
import { JobApplication } from "../../../domain/entity/job-application.entity";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class ApplyJobController {
  constructor(
    private readonly _applyJobUC: IUseCase<ApplyJobDTO, JobApplication>,
  ) {}

  apply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const validatedData = applyJobSchema.parse({
        ...req.body,
        jobId: req.params.jobId,
      });
      const application = await this._applyJobUC.execute({
        ...validatedData,
        candidateId,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.CREATED,
        SUCCESS_MESSAGES.JOB_APPLICATION_SUBMITTED_SUCCESSFULLY,
        application.toObject(),
      );
    } catch (err) {
      next(err);
    }
  };
}
