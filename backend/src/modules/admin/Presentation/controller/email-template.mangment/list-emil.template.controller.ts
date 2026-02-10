import {Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../../../constants/httpStatus";
import { ListEmailUseCase } from "../../../Application/use-Cases/email.logs/list-email-logs.usecase";

export class ListEmailTemplateController{
    constructor(
        private readonly listTemplatesUC : ListEmailUseCase
    ){};

    listEmails = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const result = await this.listTemplatesUC.execute();
            
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Templates listed succesfully",
                data : result,
            })
        }catch(err){
            return next(err);
        }
    }
}