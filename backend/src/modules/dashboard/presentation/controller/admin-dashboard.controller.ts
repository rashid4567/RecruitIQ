import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ApiResponse } from "../../../../shared/utils/api-response";
import { SUCCESS_MESSAGES } from "../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { AdminDashboardRequestDTO } from "../../application/dto/admin-dashboard.dto";

export class AdminDashboardController {
  constructor(
    private readonly _getAdminDashboardUseCase: IUseCase<
      AdminDashboardRequestDTO,
      AdminDashboardRequestDTO
    >,
  ) {}

  adminDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dashboard = await this._getAdminDashboardUseCase.execute({});
      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.ADMIN_DASHBOARD_FETCHED_SUCCESSFULLY,
        dashboard,
      );
    } catch (error) {
      next(error);
    }
  };
}
