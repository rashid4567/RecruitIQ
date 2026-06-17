import { Request, Response, NextFunction } from "express";
import { GetApplicationsByJobUseCase } from "../../../application/usecase/recruiter/GetApplicationsByJob.useCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

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
          message: "Unauthorized",
        });
      }

      const { jobId } = req.params;
      if (!jobId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Job post is required",
        });
      }

      const applications = await this.getApplicationByJobPostUC.execute(jobId);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Applications fetched successfully",
        data: applications,
      });
    } catch (err) {
      next(err);
    }
  };
}
