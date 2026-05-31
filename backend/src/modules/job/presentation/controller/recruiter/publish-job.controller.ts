import { Request, Response, NextFunction } from "express";
import { PublishJobUseCase } from "../../../application/usecase/job/publish-job.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class PublishJobController {
  constructor(private readonly publishUc: PublishJobUseCase) {}
  publish = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Hit publish controller");
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }
      const jobId = req.params.id;
      if (!jobId) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: "Jobpost not found",
        });
      }
      const job = await this.publishUc.execute(jobId, recruiterId);
      console.log("job :", job);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job published successfully",
        data: job,
      });
    } catch (err) {
      console.log("err :", err);
      next(err);
    }
  };
}
