import { Request, Response,  NextFunction } from "express";
import { DeleteEmailTemplateUseCase } from "../../../Application/use-Cases/email-template/delete-email-template.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class DeleteEmailTemplateController{
    constructor(
        private readonly DeleteTemplateUC : DeleteEmailTemplateUseCase
    ){};
    
    deleteEmailTemplate = async (req : Request, res : Response , next : NextFunction) =>{
       try{
        await this.DeleteTemplateUC.execute(req.params.id);
        return res.status(HTTP_STATUS.OK).json({
            success : true,
            message : "Template deleted succesfully"
        })
       }catch(err){
        return next(err);
       }
    }
}