import { Request, Response, NextFunction } from "express";
import { GetAllPlansUseCase } from "../../../application/useCase/subscription.plans/Getallplans.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class GetAllPlansController {
  constructor(private readonly getAllPlanUC: GetAllPlansUseCase) {}

  getActivePlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plans = await this.getAllPlanUC.execute();
      const data = plans.map((plan) => plan.toPlainObject());

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Plans fetched successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };
}
