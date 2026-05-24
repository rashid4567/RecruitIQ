import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobPostRepository } from "../../../domain/repositories/JobPostRepository";
import { ERROR_CODES } from "../../constants/error.code.constants";

export class PublishJobPostUseCase{
    constructor(private readonly JobPostRepo : JobPostRepository){};

    async execute(jobPostId : string, recruiterId : string){
        const jobPost = await this.JobPostRepo.findById(jobPostId);

        if(!jobPost){
            throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND)
        }

        if(jobPost.getRecruiterId() !== recruiterId){
            throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND)
        }


        jobPost.publish();


        return await this.JobPostRepo.save(jobPost)
    }
}