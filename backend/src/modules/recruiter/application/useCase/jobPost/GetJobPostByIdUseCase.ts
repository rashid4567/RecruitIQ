import { JobPost } from "../../../domain/entities/job-post.entity";
import { JobPostRepository } from "../../../domain/repositories/JobPostRepository";

export class GetJobPostByIdUseCase{
    constructor(private readonly jobPostRepo : JobPostRepository){};

    async execute(id : string, recruiterId : string):Promise<JobPost>{
        if(!id){
            throw new Error("Job ID is required")
        }

        if(!recruiterId){
            throw new Error("Unauthorized")
        }

        const jobPost = await this.jobPostRepo.findById(id);

        if(jobPost?.getRecruiterId() !== recruiterId){
            throw new Error("Unauthorized access to this job post")
        }
        return jobPost;
    }
}