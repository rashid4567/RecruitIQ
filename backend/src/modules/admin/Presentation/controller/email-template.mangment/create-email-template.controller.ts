import { Request, Response , NextFunction } from "express";
import { CreateEmailTempleteUseCase } from "../../../Application/use-Cases/email-template/create-email-template.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class CreateEmailTempleteController{
    constructor(
        private readonly createTemplateUC : CreateEmailTempleteUseCase,
    ){}

    createTemplete = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const result = await this.createTemplateUC.execute(req.body);

            return res.status(HTTP_STATUS.CREATED).json({
                success : true,
                message : "Email template created succesfully",
                data : result
            })

        }catch(err){
            return next(err);
        }
    }
}