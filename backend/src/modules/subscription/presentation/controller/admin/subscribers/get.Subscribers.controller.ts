import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../../../../shared/constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../../shared/constants/success-message.constants";
import { IUseCase } from "../../../../../../shared/interfaces/usecase.interface";
import {
  GetSubscribersRequestDTO,
  GetSubscribersResponseDTO,
} from "../../../../application/dto/get-subscribers.dto";
import { ApiResponse } from "../../../../../../shared/utils/api-response";

export class GetSubscribersController {
  constructor(
    private readonly _getSubscribersUC: IUseCase<
      GetSubscribersRequestDTO,
      GetSubscribersResponseDTO
    >,
  ) {}

  getSubscribers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search ? String(req.query.search) : undefined;
      const status = req.query.status ? String(req.query.status) : undefined;

      const result = await this._getSubscribersUC.execute({
        page,
        limit,
        search,
        status,
      });

      ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGES.SUBSCRIBERS_FETCHED_SUCCESSFULLY,
        result.items,
        {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      );
    } catch (error) {
      next(error);
    }
  };
}
