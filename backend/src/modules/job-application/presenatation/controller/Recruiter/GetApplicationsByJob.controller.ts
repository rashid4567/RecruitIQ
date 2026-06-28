import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { GetApplicationByJobRequestDTO } from "../../../application/dto/getApplicationByJob.dto";
import { RecruiterApplicationListItem } from "../../../domain/repository/job-application.repository";

export class GetApplicationsByJobController {
  constructor(
    private readonly getApplicationByJobPostUC: IUseCase<
      GetApplicationByJobRequestDTO,
      RecruiterApplicationListItem[]
    >,
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
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const { jobId } = req.params;
      if (!jobId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.JOB_POST_IS_REQUIRED,
        });
      }

      const applications = await this.getApplicationByJobPostUC.execute({
        jobId,
      });
      console.log("applications : ", applications)
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
