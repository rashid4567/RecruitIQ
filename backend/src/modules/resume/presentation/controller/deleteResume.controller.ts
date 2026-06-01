import { Request, Response, NextFunction } from "express";
import { DeleteResumeUseCase } from "../../application/usecase/DeleteResumeUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class DeleteResumeController {
    constructor(private readonly deleteResumeUC : DeleteResumeUseCase){};
    
    handle = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {resumeId } = req.params;

            if(!resumeId){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success : false,
                    message : "Resume is required"
                })
            }

            await this.deleteResumeUC.execute({resumeId});
            res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Resume deleted succesfully",
            })
        }catch(err){
            next(err)
        }
    }
}