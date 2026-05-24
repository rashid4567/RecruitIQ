import { Request, Response, NextFunction } from "express";
import { DeleteJobUseCase } from "../../../application/usecase/job/delete-job.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class DeleteJobController {
  constructor(private readonly deleteUC: DeleteJobUseCase) {}

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
          mesasge: "Jobpost not found",
        });
      }
      await this.deleteUC.execute(jobId, recruiterId);
      res.status(HTTP_STATUS.OK).json({
        success: false,
        message: "Job deleted succesfully",
      });
    } catch (err) {
      console.log("error :",err);
      next(err);
    }
  };
}
