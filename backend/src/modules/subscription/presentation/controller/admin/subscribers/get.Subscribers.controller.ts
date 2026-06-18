import { Request, Response, NextFunction } from "express";
import { GetSubscribersUseCase } from "../../../../application/usecase/Admin/subscribers/GetSubscribersUseCase";
import { HTTP_STATUS } from "../../../../../../constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../../constants/success-message.constants";

export class GetSubscribersController {
  constructor(private readonly getSubscribersUC: GetSubscribersUseCase) {}

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
      const result = await this.getSubscribersUC.execute({
        page,
        limit,
        search,
        status,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SUBSCRIBERS_FETCHED_SUCCESSFULLY,
        data: result.items,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
