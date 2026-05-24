import { DomainError } from "../../../../../shared/errors/domain.error";
import { JobPostRepository } from "../../../domain/repositories/JobPostRepository";
import { ERROR_CODES } from "../../constants/error.code.constants";

export class DeleteJobPostUseCase{
    constructor(private readonly JobPostRepo : JobPostRepository){};

    async execute(jobPostId : string, recruiterId : string):Promise<void>{
        const jobPost = await this.JobPostRepo.findById(jobPostId);


        if(!jobPost){
            throw new DomainError(ERROR_CODES.JOB_POST_NOT_FOUND)
        }

        if(jobPost.getRecruiterId() !== recruiterId){
            throw new DomainError(ERROR_CODES.UNAUTHORIZED_ACTION)
        }


        await this.JobPostRepo.delete(jobPostId)
    }
}