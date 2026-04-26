import { Request, Response, NextFunction } from "express";
import { PublishJobPostUseCase } from "../../../application/useCase/jobPost/publish.jobPost.useCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class PublishJobPostController {
    constructor(private readonly publishJobPostUc : PublishJobPostUseCase){};

    public = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const jobpostId = req.params.id;
            if(!jobpostId){
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success : false,
                    message : "Jobpost not found",
                })
            }
            const recruiterId = req.user?.userId;
            if(!recruiterId){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success : false,
                    message : "user not found"
                })
            }
            const result = await this.publishJobPostUc.execute( jobpostId, recruiterId);
        }catch(err){
            next(err);
        }
    }
}