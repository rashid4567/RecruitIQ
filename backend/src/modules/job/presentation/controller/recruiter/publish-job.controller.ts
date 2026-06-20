import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { PublishJobPostRequestDTO } from "../../../application/dto/publish.job.dto";
import { Job } from "../../../domain/entities/job.entity";

export class PublishJobController {
  constructor(private readonly publishUc: UseCase<PublishJobPostRequestDTO,Job>) {}
  publish = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Hit publish controller");
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      const jobId = req.params.id;
      if (!jobId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.JOB_ID_REQUIRED,
        });
      }
      const job = await this.publishUc.execute({jobId, recruiterId});
      console.log("job :", job);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.JOB_PUBLISH_SUCCESSFULLY,
        data: job,
      });
    } catch (err) {
      console.log("err :", err);
      next(err);
    }
  };
}
