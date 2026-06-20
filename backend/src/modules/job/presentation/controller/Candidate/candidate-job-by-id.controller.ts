import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { GetJobByIdRequestDTO } from "../../../application/dto/getJobPostById.dto";
import { Job } from "../../../domain/entities/job.entity";

export class CandidateJobByIdController {
  constructor(private readonly getUc: UseCase<GetJobByIdRequestDTO, Job>) {}

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.id;

      if (!jobId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.JOB_ID_REQUIRED,
        });
      }

      const job = await this.getUc.execute({ jobId, incrementView: true });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.JOB_POST_LOADED_SUCCESSFULLY,
        data: job.candidateView(),
      });
    } catch (err) {
      console.error("ERROR:", err);
      next(err);
    }
  };
}
