import type { JobPostRepository } from "@/module/recruiter/Domain/repositories/jobPost.Repository";

export class GetJobPostsUseCase{
    private readonly repo : JobPostRepository
    constructor(repo : JobPostRepository){
        this.repo = repo
    }

    async execute(){
        return this.repo.getJobPosts()
    }
}