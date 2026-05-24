import { Request, Response, NextFunction } from "express";
import { UpdateJobUseCase } from "../../../application/usecase/job/update-job.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus"; 

export class UpdateJobController {
  constructor(private readonly updateUc: UpdateJobUseCase) {}

  update = async (req: Request, res: Response, next: NextFunction) => {
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
          message: "Jobpost not found",
        });
      }
      const job = await this.updateUc.execute(jobId, recruiterId, req.body);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Job updated succesfully",
        data: job,
      });
    } catch (err) {
      console.log("error :",err);
             
      next(err);
    }
  };
}
