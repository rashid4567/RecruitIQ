import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

import { ERROR_MESSAGE } from "../../../../../constants/error-message.constants";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { GetMyApplicationRequestDTO } from "../../../application/dto/getMyApplication.dto";
import { JobApplication } from "../../../domain/entity/job-application.entity";

export class GetMyApplicationController {
  constructor(
    private readonly getMyApplicationUC: UseCase<
      GetMyApplicationRequestDTO,
      JobApplication[]
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
        data: application.map((app) => app.toObject()),
      });
    } catch (err) {
      next(err);
    }
  };
}
