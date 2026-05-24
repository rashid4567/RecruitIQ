import { Request, Response, NextFunction } from "express";
import { GetSubscriptionHistoryUseCase } from "../../../application/useCase/subscription.plans/Getsubscriptionhistory.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { paginationQuerySchema } from "../../validator/PaginationQuery.validator";

export class GetSubscriptionHistoryController {
    constructor(private readonly getSubscriptionHistoryUC : GetSubscriptionHistoryUseCase){};

    getSubscriptionHistory = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const recruiterId = req.params.recruiterId;
            if(!recruiterId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success :false,
                    message : "Recruiter not found",
                })
            }
            const {page, limit} = paginationQuerySchema.parse(req.query);

            const result = await this.getSubscriptionHistoryUC.execute({
                recruiterId,
                pagination : {page , limit},
            });

            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Subscription history fetched succesfully",
                data : result,
        });
            
        }catch(err){
            next(err);
        }
    }
}