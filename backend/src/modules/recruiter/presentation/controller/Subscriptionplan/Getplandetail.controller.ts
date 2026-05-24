import { Request, Response, NextFunction } from "express";
import { GetPlanDetailUseCase } from "../../../application/useCase/subscription.plans/Getplandetails.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { planIdParamSchema } from "../../validator/Planidparam.validator";

export class GetPlanDetailController {
  constructor(private readonly getPlansDetailUC: GetPlanDetailUseCase) {}

  getPlanDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId } = planIdParamSchema.parse(req.params)

    
      const plan = await this.getPlansDetailUC.execute({ planId });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Plan details fetched succesfully",
        data: plan,
      });
    } catch (err) {
      next(err);
    }
  };
}
