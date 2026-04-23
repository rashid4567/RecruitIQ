import { Request, Response, NextFunction } from "express";
import { GetJobPostByIdUseCase } from "../../../Application/use-Cases/jobPost-mangment/getJobPostById.useCase";
import { HTTP_STATUS } from "../../../../../constants/httpStatus";


export class GetJobPostByIdController{
    constructor(private readonly getJobPostUc : GetJobPostByIdUseCase){};

    getJobPosyById = async (req : Request, res : Response, next : NextFunction) =>{
        try{
            const {jobPostId} = req.params;
            if(!jobPostId){
               return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success : false,
                    message : "Job post not found",
                })
            }

            const jobPost = await this.getJobPostUc.execute(jobPostId);
            return res.status(HTTP_STATUS.OK).json({
                success : true,
                message : "Job post laoded succesfully",
                data : jobPost
            })

        }catch(err){
            next(err)
        }
    }
}