import { Request, Response, NextFunction } from "express";
import { CancelSubscriptionUseCase } from "../../../application/useCase/subscription.plans/Cancelsubscription.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { cancelSubscriptionSchema } from "../../validator/CancelSubscription.validator";


export class CancelSubscriptionController{
    constructor(private readonly cancelSubscriptionUC : CancelSubscriptionUseCase){};
    
    cancelSubscription = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {note, cancelAtPeriodEnd} = cancelSubscriptionSchema.parse(req.body);

            const recruiterId = req.params.recruiterId;
            if(!recruiterId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message : "Recruiter not found",
                })
            }

                const subscription = await this.cancelSubscriptionUC.execute({
                    recruiterId,
                    note,
                    cancelAtPeriodEnd,
                })

            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Subscription cancelled succesfully",
                data : subscription,
            })
        }catch(err){
            next(err);
        }
    }
}