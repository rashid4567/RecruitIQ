import { Request, Response, NextFunction } from "express";
import { CreateOrderUseCase } from "../../../application/useCase/subscription.plans/Createorder.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
export class CreateSubscriptionController {
  constructor(private readonly createOrderUC: CreateOrderUseCase) {}

  createSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recruiterId = req.user?.userId;
      const planId = req.body?.planId;
      if (!recruiterId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,

          message: "Unauthorized",
        });
      }

      if (!planId || typeof planId !== "string") {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,

          message: "planId is required",
        });
      }

      const result = await this.createOrderUC.execute({
        recruiterId,

        planId,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,

        message: "Order created successfully",

        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
