import { Request, Response, NextFunction } from "express";
import { ChangePlanUseCase } from "../../../application/useCase/subscription.plans/Changeplan.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { changePlanSchema } from "../../validator/ChangePlan.validator";

export class ChangePlanController {
    constructor(private readonly changePlanUC : ChangePlanUseCase){};

    changePlan = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {newPlanId, newEndDate, newRazorpaySubscriptionId} = changePlanSchema.parse(req.body);
            const recruiterId = req.params.recruiterId;
            if(!recruiterId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message : "Recruiter not found"
                })
            }

            const result = await this.changePlanUC.execute({
                recruiterId,
                newPlanId,
                newEndDate : new Date(newEndDate),
                newRazorpaySubscriptionId,
            })

            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : `Plan ${result.direction}d succesfully`,
                data : result,
            })
        }catch(err){
            next(err);
        }
    }
}