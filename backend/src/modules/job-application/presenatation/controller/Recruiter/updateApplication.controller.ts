import { Request, Response, NextFunction } from "express";
import { UpdateApplicationStatusUseCase } from "../../../application/usecase/recruiter/UpdateApplicationStatusUseCase";
import { ApplicationStatus } from "../../../domain/entity/job-application.entity";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UpdateApplicationStatusDTO } from "../../../application/dto/UpdateApplicationStatusDTO";

export class UpdateApplicationStatusController {
  constructor(
    private readonly updateApplicationStatusUseCase: UseCase<
      UpdateApplicationStatusDTO,
      void
    >,
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
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
        return;
      }

      const { applicationId } = req.params;

      if (!applicationId?.trim()) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGE.APPLICATION_REQUIRED,
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
          message: ERROR_MESSAGE.INVALID_APPLICATION_STATUS,
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
