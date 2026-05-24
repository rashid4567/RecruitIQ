import { Request, Response, NextFunction } from "express";
import { GetTotalSpendUseCase } from "../../../application/useCase/subscription.plans/Gettotalspend.usecase ";
import { userIdSchema } from "../../validator/userId.validator";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { getTotalSpendSchema } from "../../validator/Billing.validator";


export class GetTotalSpendController {
    constructor(private readonly getTotalSpendUC : GetTotalSpendUseCase){};

    getTotalSpend = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const recruiterId = userIdSchema.parse(req.user?.userId);
            if(!recruiterId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message : "Recruiter not found",
                })
            }
            
            const query = getTotalSpendSchema.parse(req.query);
            const result = await this.getTotalSpendUC.execute({
                recruiterId,
                fromDate : query.fromDate,
                toDate : query.toDate,
            })

            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Total Spend fetched succesfully",
                data : result,
            })
        }catch(err){
            next(err);
        }
    }
}