import { Request, Response, NextFunction } from "express";
import { UpdateEmailTemplateUseCase } from "../../../application/usecase/email-template/update-email-template.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class UpdateEmailTemplateController{
    constructor(
        private readonly updateTemplateUC : UpdateEmailTemplateUseCase
    ){};

    updateEmailTemplate = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const result = await this.updateTemplateUC.execute(req.params.id, req.body);

            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Template updated succesfully",
                data : result,
            })
        }catch(err){
            return next(err);
        }
    }
}