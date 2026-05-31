import { Request, Response, NextFunction } from "express";
import { UpgradeSubscriptionUseCase } from "../../../application/usecase/Recruiter/UpgradeSubscriptionUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class UpgradeSubscriptionController {
    constructor(
        private readonly upgradeSubscriptionUC : UpgradeSubscriptionUseCase
    ){};

    upgrade = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const recruiterId = req.user?.userId;

            if(!recruiterId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message : "Unauthorized"
                })
            }
            const {planId}= req.body;
            if(!planId){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success : false,
                    message : "PlanId is required"
                })
            }
            const subscription = await this.upgradeSubscriptionUC.execute(recruiterId, planId)
            return res.status(HTTP_STATUS.OK).json({
                success :  true,
                message : "Subscription Upgrade succesfully",
                data : subscription,
            })
        }catch(err){
            next(err);
        }
    }
}