import { Request, Response, NextFunction } from "express";
import { GetJobByIdUseCase } from "../../../application/usecase/job/get-jobpost-by-id.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class CandidateJobByIdController {
  constructor(private readonly getUc: GetJobByIdUseCase) {}

  getOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const jobId = req.params.id;

      if (!jobId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.JOB_ID_REQUIRED,
        });
      }

      const job = await this.getUc.execute(jobId, true);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: job.candidateView(),
      });
    } catch (err) {
      console.error("ERROR:", err);
      next(err);
    }
  };
}