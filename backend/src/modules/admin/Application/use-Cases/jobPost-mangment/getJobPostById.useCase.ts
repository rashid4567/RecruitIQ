import { JobPost } from "../../../Domain/entities/jobPost-entity";
import { JobPostRepostory } from "../../../Domain/repositories/jobPost-repository";

export class GetJobPostByIdUseCase{
    constructor(private repo : JobPostRepostory){};

    async execute(id : string):Promise<JobPost>{
        if(!id){
            throw new Error("Job Post ID is required")
        }

        const jobPost = await this.repo.findById(id);

        if(!jobPost){
            throw new Error("Job post not found")
        }

        return jobPost;
    }
}