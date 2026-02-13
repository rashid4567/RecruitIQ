import { Request , Response , NextFunction } from "express";
import { toggleEmailTemplateUseCase } from "../../../Application/use-Cases/email-template/toggle-email-template.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class ToggleEmailTemplateController{
    constructor(
        private readonly toggleTemplateUC : toggleEmailTemplateUseCase
    ){}
        toggleEmailTemplate  = async (req : Request, res : Response , next : NextFunction) =>{
            try{
                const {isActive} = req.body;

                if(typeof isActive !== "boolean"){
                    return res.status(HTTP_STATUS.BAD_REQUEST).json({
                        success : false,
                        message : "isActive must be a boolean"
                    })
                }

                const result = await this.toggleTemplateUC.execute(req.params.id, isActive);
                return res.status(HTTP_STATUS.OK).json({
                    success : true,
                    message : "Email template status updated",
                    data : result
                })
            }catch(err){
                return next(err)
            }
        }
    
}