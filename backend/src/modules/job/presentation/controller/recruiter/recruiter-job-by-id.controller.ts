import { Request, Response, NextFunction } from "express";
import { GetJobByIdUseCase } from "../../../application/usecase/job/get-jobpost-by-id.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class RecruiterJobByIdController {
  constructor(private readonly getUc: GetJobByIdUseCase) {}

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      
      if(!recruiterId){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success : false,
            message : "Unauthorized"
        })
      }

      const jobId = req.params.id;

      if(!jobId){
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            success : false,
            message : "Jobpost not found"
        })
      }
      const job = await this.getUc.execute(jobId);
      if (!job.belongsToRecruiter(recruiterId!)) {
        throw new Error("Unauthorized");
      }
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: job,
      });
    } catch (err) {
      next(err);
    }
  };
}
