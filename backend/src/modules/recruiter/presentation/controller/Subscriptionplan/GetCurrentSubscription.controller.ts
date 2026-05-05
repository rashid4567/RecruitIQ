import { Request, Response, NextFunction } from "express";
import { GetCurrentSubscriptionUseCase } from "../../../application/useCase/subscription.plans/Getcurrentsubscription.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class GetCurrentSubscriptionController{
    constructor(private readonly getCurrentSubscriptionUC : GetCurrentSubscriptionUseCase){};

    getCurrentSubscription = async (req : Request, res :Response, next : NextFunction) =>{
        try{
            const recruiterId = req.params.recruiterId;
            if(!recruiterId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message : "Recruiter not found",
                })
            }

            const subscription = await this.getCurrentSubscriptionUC.execute({recruiterId});
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Currenct subscription fetched succesfully",
                data : subscription
            })
        }catch(err){
            next(err);
        }
    }
}