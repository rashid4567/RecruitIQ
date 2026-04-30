import { Request, Response, NextFunction } from "express";
import { CreateSubscriptionPlanUseCase } from "../../../Application/use-Cases/subscription-plan/create-plan.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { CreatePlanSchema } from "../../validator/subscription-plan.schema";


export class CreateSubscriptionPlanController{
    constructor(private readonly createPlanUC : CreateSubscriptionPlanUseCase){}

    createPlan = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const input =  CreatePlanSchema.parse(req.body);
            const result = await this.createPlanUC.execute(input);

            return res.status(HTTP_STATUS.CREATED).json({
                success : true,
                message : "Subscribtion plan created successfully",
                data : result,
            })
        }catch(err){
            next(err)
        }
    }

}