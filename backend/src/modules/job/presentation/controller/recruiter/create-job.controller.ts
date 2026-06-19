import { Request, Response, NextFunction } from "express";
import { CreateJobUseCase } from "../../../application/usecase/job/create-job.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { CreateJobSchema } from "../../validator/create.jobpost.validation";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { createJobPostRequestDTO } from "../../../application/dto/create-job.dto";
import { Job } from "../../../domain/entities/job.entity";

export class CreateJobController {
  constructor(
    private readonly createUc: UseCase<createJobPostRequestDTO, Job>,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const dto = CreateJobSchema.parse(req.body);

      const job = await this.createUc.execute({ recruiterId, dto });
      console.log("job :", job);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.JOB_CREATED_SUCCESSFULLY,
        data: job,
      });
    } catch (err) {
      console.log("err", err);
      next(err);
    }
  };
}
