import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";

import { ERROR_MESSAGE } from "../../../../../shared/constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import {
  CandidateApplicationListItemDTO,
  GetMyApplicationRequestDTO,
} from "../../../application/dto/getMyApplication.dto";

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
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGE.UNAUTHORIZED,
        });
      }

      const application = await this.getMyApplicationUC.execute({
        candidateId,
      });
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.APPLICATION_LOADED_SUCCESSFULLY,
        data: application,
      });
    } catch (err) {
      next(err);
    }
  };
}
