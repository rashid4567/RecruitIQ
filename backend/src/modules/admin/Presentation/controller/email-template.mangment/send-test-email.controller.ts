import { Request,  Response, NextFunction } from "express";
import { SendTestEmailUseCase } from "../../../Application/use-Cases/email-template/send-test-email.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class SendTestEmailController{
    constructor(
        private readonly sendTestEmailUC : SendTestEmailUseCase
    ){};
    sendTestEmail = async (req : Request, res : Response , next : NextFunction) =>{
        try{
            const {email} = req.body;
            if(!email){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message : "Email is required"
                })
            }
            await this.sendTestEmailUC.execute({
            templateId : req.params.id,
            to : email,
        })
            res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Test email send succesfully"
            })
        }catch(err){
            return next(err);
        }
    }
}