import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobPost } from "../../../domain/entities/job-post.entity";
import { JobPostRepository } from "../../../domain/repositories/JobPostRepository";
import { ERROR_CODES } from "../../constants/error.code.constants";

export class GetJobPostByIdUseCase{
    constructor(private readonly jobPostRepo : JobPostRepository){};

    async execute(id : string, recruiterId : string):Promise<JobPost>{
        if(!id){
            throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND)
        }

        if(!recruiterId){
            throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND)
        }

        const jobPost = await this.jobPostRepo.findById(id);

        if(jobPost?.getRecruiterId() !== recruiterId){
            throw new Error("Unauthorized access to this job post")
        }
        return jobPost;
    }
}