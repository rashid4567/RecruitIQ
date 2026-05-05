import { Request, Response, NextFunction } from "express";
import { RenewSubscriptionUseCase } from "../../../application/useCase/subscription.plans/Renewsubscription.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { renewSubscriptionSchema } from "../../validator/RenewSubscription.validator";


export class RenewSubscriptionController {
    constructor(private readonly renewSubscriptionUC : RenewSubscriptionUseCase){};


    renewSubscription = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {newStartDate, newEndDate, newRenewsAt} = renewSubscriptionSchema.parse(req.body);
            const subscriptionId = req.params.subscriptionId;
            
            if(!subscriptionId){
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success : false,
                    message : "Subscription not found",
                })
            }

            const subscription = await this.renewSubscriptionUC.execute({
                subscriptionId,
                newStartDate : new Date(newStartDate),
                newEndDate : new Date(newEndDate),
                newRenewsAt : newRenewsAt ? new Date(newRenewsAt) : undefined,
            })
        }catch(err){
            next(err);
        }
    }
}