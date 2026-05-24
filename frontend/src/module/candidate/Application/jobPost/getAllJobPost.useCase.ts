

import type { JobPostFilters, PaginatedJobPosts } from "../../../jobs/domain/dto/JobPostDTO";
import type { jobPostRepository } from "../../domain/repositories/jobPost.Repository";

export class GetAllJobPostUseCase{
    private readonly jobPostRepo : jobPostRepository;
    constructor(jobPostRepo : jobPostRepository){
        this.jobPostRepo = jobPostRepo;
    }

    async execute(filter : JobPostFilters):Promise<PaginatedJobPosts>{
        return this.jobPostRepo.getAll(filter)
    }
}