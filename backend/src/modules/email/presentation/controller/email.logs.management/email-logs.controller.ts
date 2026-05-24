import { Request, Response ,NextFunction } from "express";
import { ListEmailLogsUseCase } from "../../../../email/application/usecase/email.logs/list-email-logs.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class EmailLogsController {
    constructor(
        private readonly listLoginUC : ListEmailLogsUseCase
    ){};

    list = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const logs = await this.listLoginUC.execute();
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Email logs loaded succesfully",
                data : logs
            })
        }catch(err){
            return next(err);
        }
    }
}