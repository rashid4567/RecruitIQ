import { Request, Response, NextFunction } from "express";
import { ApplicationStatus } from "../../../domain/entity/job-application.entity";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UpdateApplicationStatusDTO } from "../../../application/dto/UpdateApplicationStatusDTO";
import { ApiResponse } from "../../../../../shared/utils/api-response";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";

export class UpdateApplicationStatusController {
  constructor(
    private readonly updateApplicationStatusUseCase: IUseCase<
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
        ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
        return;
      }

      const { applicationId } = req.params;

      if (!applicationId?.trim()) {
        ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.APPLICATION_REQUIRED,
        );
        return;
      }

      const { status, rejectionReason } = req.body;
      const allowedStatuses = [
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.INTERVIEW_SCHEDULED,
        ApplicationStatus.SELECTED,
        ApplicationStatus.REJECTED,
      ];

      if (!allowedStatuses.includes(status)) {
        ApiResponse.error(
          res,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.INVALID_APPLICATION_STATUS,
        );
        return;
      }

      await this.updateApplicationStatusUseCase.execute({
        applicationId,
        recruiterId,
        status,
        rejectionReason,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.APPLICATION_STATUS_UPDATED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  };
}
