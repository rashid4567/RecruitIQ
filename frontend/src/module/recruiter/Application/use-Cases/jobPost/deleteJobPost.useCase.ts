import type { JobPostRepository } from "@/module/recruiter/Domain/repositories/jobPost.Repository";

export class DeleteJobPostUseCase{
    private readonly repo : JobPostRepository;
    constructor(repo : JobPostRepository){
        this.repo = repo;
    }

    async execute(id : string):Promise<void>{
        if(!id){
            throw new Error("Job Post ID is required")
        }

        await this.repo.deleteJobPost(id)
    }
}