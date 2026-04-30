
import type { JobPostRepository } from "../../../domain/repositories/jobPost.repository";
import type { GetJobPostsQuery } from "../../dto/jobpost-query";

export class GetJobPostListUseCase {
    private readonly jobPostRepo :JobPostRepository;
    constructor(jobPostRepo : JobPostRepository){
        this.jobPostRepo = jobPostRepo;
    }

    async execute(query : GetJobPostsQuery){
        return this.jobPostRepo.getJobPosts(query);
    }
}