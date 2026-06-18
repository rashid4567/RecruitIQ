import { Request, Response, NextFunction } from "express";
import { UpdateEmailTemplateUseCase } from "../../../application/usecase/email-template/update-email-template.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { SUCCESS_MESSAGES } from "../../../../../constants/success-message.constants";

export class UpdateEmailTemplateController{
    constructor(
        private readonly updateTemplateUC : UpdateEmailTemplateUseCase
    ){};

    updateEmailTemplate = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const result = await this.updateTemplateUC.execute(req.params.id, req.body);

            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : SUCCESS_MESSAGES.TEMPLATE_UPDATED_SUCCESSFULLY, 
                data : result,
            })
        }catch(err){
            return next(err);
        }
    }
}