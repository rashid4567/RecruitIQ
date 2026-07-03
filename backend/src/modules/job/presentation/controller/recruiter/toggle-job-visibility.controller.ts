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
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class ToggleJobVisibilityController {
  constructor(
    private readonly _hideUC: IUseCase<HideJobPostRequestDTO, Job>,
    private readonly _unhideUC: IUseCase<UnHideJobPostRequestDTO, Job>,
  ) {}

  hide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
              return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }
      const jobId = req.params.id;
      const job = await this._hideUC.execute({ jobId, recruiterId });
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.JOB_HIDE_SUCCESSFULLY,
        job
      )
    } catch (err) {
      next(err);
    }
  };

  unhide = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recruiterId = req.user?.userId;
      if (!recruiterId) {
              return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }
      const jobId = req.params.id;

      const job = await this._unhideUC.execute({ jobId, recruiterId });
        ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.JOB_UNHIDE_SUCCESSFULLY,
        job
      )
    } catch (err) {
      next(err);
    }
  };
}
