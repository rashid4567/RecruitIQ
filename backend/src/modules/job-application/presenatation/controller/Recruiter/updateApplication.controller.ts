import { Request, Response, NextFunction } from "express";
import { UpdateApplicationStatusUseCase } from "../../../application/usecase/recruiter/UpdateApplicationStatusUseCase";
import { ApplicationStatus } from "../../../domain/entity/job-application.entity";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class UpdateApplicationStatusController {
  constructor(
    private readonly updateApplicationStatusUseCase: UpdateApplicationStatusUseCase,
  ) {}

  updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const { applicationId } = req.params;

      if (!applicationId?.trim()) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Application ID is required",
        });
        return;
      }

      const { status, rejectionReason } = req.body;

      const allowedStatuses = [
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.SELECTED,
        ApplicationStatus.REJECTED,
      ];

      if (!allowedStatuses.includes(status)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Invalid application status",
        });
        return;
      }

      await this.updateApplicationStatusUseCase.execute({
        applicationId,
        recruiterId,
        status,
        rejectionReason,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Application status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
