import type { JobPostRepository } from "@/module/recruiter/Domain/repositories/jobPost.Repository";

export class GetJobPostByIdUseCase{
    private readonly repo : JobPostRepository
    constructor(repo : JobPostRepository){
        this.repo = repo;
    }

    async execute(id : string){
        if(!id)throw new Error("Job id is  required");

        return this.repo.getJobPostById(id)
    }
}
