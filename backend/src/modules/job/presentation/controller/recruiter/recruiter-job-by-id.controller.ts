import { Request, Response, NextFunction } from "express";
import { GetJobByIdUseCase } from "../../../application/usecase/job/get-jobpost-by-id.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";

export class RecruiterJobByIdController {
  constructor(private readonly getUc: GetJobByIdUseCase) {}
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if(!recruiterId){
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success : false,
            message : ERROR_MESSAGE.UNAUTHORIZED,
        })
      }

      const jobId = req.params.id;
      if(!jobId){
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success : false,
            message :ERROR_MESSAGE.JOB_ID_REQUIRED
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
