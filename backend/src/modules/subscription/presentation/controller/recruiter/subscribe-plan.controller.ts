import { Request , Response, NextFunction } from "express";
import { SubscribePlanUseCase } from "../../../application/usecase/Recruiter/subscribe-plan.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class SubscribePlanController{
    constructor(private readonly subscribeUC : SubscribePlanUseCase){};

    subscribe = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const recruiterId = req.user?.userId;

            if(!recruiterId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message : "Unauthorized"
                })
            }
            
            const {planId} = req.body;
            if(!planId){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success : false,
                    message : "PlanId is required"
                })
            }
            const result = await this.subscribeUC.execute(recruiterId, planId)

            res.status(HTTP_STATUS.CREATED).json({
                success : true,
                message : "Subscription created succesfully",
                data : result
            })
        }catch(err){
            next(err);
        }
    }
}