import { Request, Response, NextFunction } from "express";
import { PublishJobUseCase } from "../../../application/usecase/job/publish-job.usecase"; 
import { HTTP_STATUS } from "../../../../../constants/httpStatus"; 

export class PublishJobContrtoller{
    constructor(private readonly publishUc : PublishJobUseCase){};

    publish = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const recruiterId = req.user?.userId;
            if(!recruiterId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message : "Unauthorized"
                })
            }
            const jobId = req.params.id;
            if(!jobId){
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success : false,
                    message : "Jobpost not found"
                })
            }
            const job = await this.publishUc.execute(jobId, recruiterId!)
            
            res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Job Published",
                data : job
            })
        }catch(err){
            console.log("error :",err);
            
            next(err);
        }
    }
}