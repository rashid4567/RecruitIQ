import { Request, Response, NextFunction } from "express";
import { GetResumeByIdUseCase } from "../../application/usecase/GetResumeByIdUseCase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class GetResumeByIdController{
    constructor(
        private readonly getResumeByIdUC : GetResumeByIdUseCase
    ){};

    handle = async (req : Request, res : Response, next: NextFunction) =>{
        try{
            const {resumeId} = req.params;
            if(!resumeId){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success : false,
                    message : "Resume is required"
                })
            }
            const resume = await this.getResumeByIdUC.execute({
                resumeId
            });

            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Resume loaded successfully",
                data : resume
            })
        }catch(err){
            next(err);
        }
    }
}