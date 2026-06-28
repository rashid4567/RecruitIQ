import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";

import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  CandidateApplicationListItemDTO,
  GetMyApplicationRequestDTO,
} from "../../../application/dto/getMyApplication.dto";
import { ApiResponse } from "../../../../../shared/utils/api-response";

export class GetMyApplicationController {
  constructor(
    private readonly getMyApplicationUC: IUseCase<
      GetMyApplicationRequestDTO,
      CandidateApplicationListItemDTO[]
    >,
  ) {}

  getMyApplication = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGE.UNAUTHORIZED,
        );
      }

      const application = await this.getMyApplicationUC.execute({
        candidateId,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.APPLICATION_LOADED_SUCCESSFULLY,
        application,
      );
    } catch (err) {
      next(err);
    }
  };
}
