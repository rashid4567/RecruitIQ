import { Request, Response, NextFunction } from "express";
import { DeactivateSubscriptionPlanUseCase } from "../../../application/usecase/deactivate-subscription-plan.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class HideSubscriptionPlanController{
    constructor(private readonly hideUC : DeactivateSubscriptionPlanUseCase){};
    hide = async(req : Request, res : Response, next : NextFunction) =>{
        try{
            await this.hideUC.execute(req.params.planId);
            res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Plan hidden"
            })
        }catch(err){
            next(err);
        }
    }
}