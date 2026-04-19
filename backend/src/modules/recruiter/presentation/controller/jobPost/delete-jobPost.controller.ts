import { Request, Response, NextFunction } from "express";
import { DeleteJobPostUseCase } from "../../../application/useCase/jobPost/delete-job-post.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class DeleteJobPostController {
    constructor(private readonly deleteJobPostUc : DeleteJobPostUseCase){};
   handle = async (req : Request, res : Response, next : NextFunction) =>{
    try{
        const JobPostId = req.params.id;
        const recruiterId = req.user?.userId;

        if(!recruiterId){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success : false,
                message : "Unauthorized"
            })
        }
        await this.deleteJobPostUc.execute(JobPostId,recruiterId);
        return res.status(HTTP_STATUS.OK).json({
            success : true,
            message : "JobPost Delete succesfully",
        })
    }catch(err){
        next(err)
    }
   }
}