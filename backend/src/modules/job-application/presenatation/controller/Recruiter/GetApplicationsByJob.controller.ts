import { Request, Response, NextFunction } from "express";
import { GetApplicationsByJobUseCase } from "../../../application/usecase/recruiter/GetApplicationsByJob.useCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class GetApplicationsByJobController {
  constructor(
    private readonly getApplicationByJobPostUC: GetApplicationsByJobUseCase,
  ) {}

  GetJobpostBasedApplicatiton = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED
        });
      }

      const { jobId } = req.params;
      if (!jobId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.JOB_POST_IS_REQUIRED 
        });
      }

      const applications = await this.getApplicationByJobPostUC.execute(jobId);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.APPLICATIONS_FETCHED_SUCCESSFULLY,
        data: applications,
      });
    } catch (err) {
      next(err);
    }
  };
}
