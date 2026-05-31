import { Request, Response, NextFunction } from "express";
import { CreatePaymentOrderUseCase } from "../../../application/usecase/Recruiter/CreatePaymentOrderUseCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";


export class CreatePaymentOrderController {
    constructor(private readonly createPaymentUc : CreatePaymentOrderUseCase){}

     create = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const recruiterId  = req.user?.userId;

            if(!recruiterId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message : "Unautorized",
                })
            }
            const {planId} = req.body;

            if(!planId){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success : false,
                    message : "Plan Id is required",
                })
            }
            const result = await this.createPaymentUc.execute({recruiterId, planId});
            res.status(HTTP_STATUS.CREATED).json({
                success : true,
                message : "Payment Order created successfully",
                data : result
            })
        }catch(err){
            next(err);
        }
    }
}