import { Request , Response, NextFunction } from "express";
import { UnblockJobPostUseCase } from "../../../Application/use-Cases/jobPost-management/update-JobPost.status.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";

export class UnblockJobPostController {
    constructor(private readonly unblockJobPostUC : UnblockJobPostUseCase){};
    
    unblock = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {jobPostId} = req.params;
            if(!jobPostId){
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success : false,
                    message : "Job post not found",
                })
            }
            const jobPost = await this.unblockJobPostUC.execute(jobPostId)
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Jobpost unblock succesfully"
            })
        }catch(err){
            next(err);
        }
    }
}