import { Request, Response, NextFunction } from "express";
import { PublishJobUseCase } from "../../../application/usecase/job/publish-job.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class PublishJobController {
  constructor(private readonly publishUc: PublishJobUseCase) {}
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
      const job = await this.publishUc.execute(jobId, recruiterId);
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
