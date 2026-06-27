import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { GetJobByIdRequestDTO } from "../../../application/dto/getJobPostById.dto";
import { Job } from "../../../domain/entities/job.entity";

export class RecruiterJobByIdController {
  constructor(private readonly getUc: IUseCase<GetJobByIdRequestDTO, Job>) {}
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
      const job = await this.getUc.execute({jobId});
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
