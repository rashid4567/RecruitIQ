import type { JobPostRepository } from "../../../domain/repositories/jobPost.repository"

export class BlockJobPostUseCase {
    private readonly jobPostRepo : JobPostRepository;
    constructor(jobPostRepo : JobPostRepository){
        this.jobPostRepo = jobPostRepo;
    }

    async execute(jobPostId : string){
        return this.jobPostRepo.blockJobPost(jobPostId)
    }
}