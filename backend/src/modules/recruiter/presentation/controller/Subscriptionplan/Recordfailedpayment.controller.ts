import {Request, Response, NextFunction } from "express";
import { RecordFailedPaymentUseCase } from "../../../application/useCase/subscription.plans/Recordfailedpayment.usecase";
import { userIdSchema } from "../../validator/userId.validator";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { recordFailedPaymentSchema } from "../../validator/Billing.validator";

export class RecordFailedPaymentController{
    constructor(private readonly recordFailedPaymentUC : RecordFailedPaymentUseCase ){};
    
    recordFailedPayment = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const recruiterId = userIdSchema.parse(req.user?.userId);
            if(!recruiterId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message : 'Recruiter not found'
                })
            }

            const body = recordFailedPaymentSchema.parse(req.body);
       const record = await this.recordFailedPaymentUC.execute({
        recruiterId,
        subscriptionId:    body.subscriptionId,
        planId:            body.planId,
        planName:          body.planName,
        amount:            body.amount,
        currency:          body.currency,
        netAmount:         body.netAmount,
        razorpayPaymentId: body.razorpayPaymentId,
        razorpayOrderId:   body.razorpayOrderId,
        failureReason:     body.failureReason,
        eventType:         body.eventType,
        periodStart:       body.periodStart,
        periodEnd:         body.periodEnd,
      });

      return res.status(HTTP_STATUS.OK).json({
        success : true,
        message : "Failed payment recorded succesfully",
        data : record,
      })
        }catch(err){
            next(err)
        }
    }
}