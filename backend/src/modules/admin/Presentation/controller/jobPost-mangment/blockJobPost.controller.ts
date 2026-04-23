import { Request,Response,NextFunction } from "express";
import { BlockJobPostUseCase } from "../../../Application/use-Cases/jobPost-mangment/update-JobPost.status.usecase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";


export class BlockJobPostController {
    constructor(private readonly blockJobPost : BlockJobPostUseCase){};
    
    block = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {jobPostId} = req.params;
            if(!jobPostId){
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success : false,
                    message : "Job post not  found",
                })
            }
            const jobPost = await this.blockJobPost.execute(jobPostId)
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "JobPost Blocked succesfully",
            })
        }catch(err){
            next(err);
        }
    }
}