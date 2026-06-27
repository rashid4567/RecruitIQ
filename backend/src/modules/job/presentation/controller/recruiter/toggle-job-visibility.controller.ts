import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  HideJobPostRequestDTO,
  UnHideJobPostRequestDTO,
} from "../../../application/dto/job.status.dto";
import { Job } from "../../../domain/entities/job.entity";

export class ToggleJobVisibilityController {
  constructor(
    private readonly hideUC: IUseCase<HideJobPostRequestDTO, Job>,
    private readonly unhideUC: IUseCase<UnHideJobPostRequestDTO, Job>,
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
