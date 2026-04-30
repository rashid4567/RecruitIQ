import type { JobPostRepository } from "../../../domain/repositories/jobPost.repository"

export class UnblockJobPostUseCase {
    private readonly  jobPostRepo :JobPostRepository;
    constructor(jobPostRepo : JobPostRepository){
        this.jobPostRepo = jobPostRepo;
    }
    async execute(jobPostId : string){
        return this.jobPostRepo.unblockJobPost(jobPostId);
    }
}