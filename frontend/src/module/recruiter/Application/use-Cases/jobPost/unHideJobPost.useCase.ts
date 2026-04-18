import type { JobPostRepository } from "@/module/recruiter/Domain/repositories/jobPost.Repository";

export class unhideJobPostUseCase{
    private readonly repo : JobPostRepository;
    constructor(
        repo : JobPostRepository
    ){
        this.repo = repo
    }

    async execute(id : string){
        if(!id)throw new Error("Job ID is required");

        return this.repo.unhideJobPost(id);
    }
}