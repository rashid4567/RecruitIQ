import { Request, Response, NextFunction } from "express";
import { UpdateSubscriptionPlanUseCase } from "../../../../application/usecase/Admin/subscription/update-subscription-plan.usecase";
import { UpdatePlanSchema } from "../../../validator/subscription-plan.schema";
import { HTTP_STATUS } from "../../../../../../constants/httpStatus";


export class UpdateSubscriptionPlanController{
    constructor(private readonly updateUc : UpdateSubscriptionPlanUseCase){};
    update = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {planId} = req.params;   
            if(!planId){
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success : false,
                    message : "Plan not found"
                })
            }
            const input = UpdatePlanSchema.parse(req.body);
            console.log("input :-", input);
            const result = await this.updateUc.execute(planId, input)
            res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Plan update succesfully",
                data : result
            })
        }catch(err){
            next(err);
        }
    }
}