import { Request, Response, NextFunction } from "express";
import { ApplyJobUseCase } from "../../../application/usecase/candidate/ApplyJobUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { applyJobSchema } from "../../validator/apply-job.validator";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { ApplyJobDTO } from "../../../application/dto/applyJobDto";
import { JobApplication } from "../../../domain/entity/job-application.entity";

export class ApplyJobController {
  constructor(
    private readonly applyJobUC: UseCase<ApplyJobDTO, JobApplication>,
  ) {}

  apply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const validatedData = applyJobSchema.parse({
        ...req.body,
        jobId: req.params.jobId,
      });

      const application = await this.applyJobUC.execute({
        ...validatedData,
        candidateId,
      });

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.JOB_APPLICATION_SUBMITTED_SUCCESSFULLY,
        data: application.toObject(),
      });
    } catch (err) {
      next(err);
    }
  };
}
