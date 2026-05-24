import {Request, Response, NextFunction } from "express";
import { GetPlanByUseCase } from "../../../Application/use-Cases/subscription-plan/get-plan-by-id.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class GetPlanByIdController{
    constructor(private readonly getPlandByIdUC : GetPlanByUseCase){};
    getPlanById = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {planId} = req.params;
            const plan = await this.getPlandByIdUC.execute(planId);

            res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Plan loaded succesfully",
                data :plan,
            })
        }catch(err){
            next(err);
        }
    }
}