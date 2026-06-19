import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { HideJobUseCase } from "../../../application/usecase/job/hide-job.usecase";
import { UnhideJobUseCase } from "../../../application/usecase/job/unhide-job.post.usecase";
import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  HideJobPostRequestDTO,
  UnHideJobPostRequestDTO,
} from "../../../application/dto/job.status.dto";
import { Job } from "../../../domain/entities/job.entity";

export class ToggleJobVisibilityController {
  constructor(
    private readonly hideUC: UseCase<HideJobPostRequestDTO, Job>,
    private readonly unhideUC: UseCase<UnHideJobPostRequestDTO, Job>,
  ) {}

  hide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      const jobId = req.params.id;
      const job = await this.hideUC.execute({ jobId, recruiterId });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.JOB_HIDE_SUCCESSFULLY,
        data: job,
      });
    } catch (err) {
      next(err);
    }
  };

  unhide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }
      const jobId = req.params.id;

      const job = await this.unhideUC.execute({ jobId, recruiterId });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.JOB_UNHIDE_SUCCESSFULLY,
        data: job,
      });
    } catch (err) {
      console.log("error :", err);

      next(err);
    }
  };
}
