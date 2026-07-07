import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import {
  RecruiterDashboardDTO,
  RecruiterDashboardRequestDTO,
} from "../../application/dto/recruiter-dashboard.dto";
import { ApiResponse } from "../../../../shared/utils/api-response";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";

export class RecruiterDashboardController {
  constructor(
    private readonly _getRecruiterDashBoardUC: IUseCase<
      RecruiterDashboardRequestDTO,
      RecruiterDashboardDTO
    >,
  ) {}

  recruiterDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recruiterId = req.user?.userId;

      if (!recruiterId) {
        return ApiResponse.error(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.UNAUTHORIZED,
        );
      }

      const dashboard = await this._getRecruiterDashBoardUC.execute({
        recruiterId,
      });

      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.RECRUITER_DASHBOARD_FETCHED_SUCCESSFULLY,
        dashboard,
      );
    } catch (err) {
      next(err);
    }
  };
}
