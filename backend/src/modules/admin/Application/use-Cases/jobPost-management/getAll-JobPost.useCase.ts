import { JobPostRepostory } from "../../../Domain/repositories/jobPost-repository";
import { GetJobPostsQuery } from "../../dto/recruiter.dto/jobPost.query";


export class GetAllJobPostsUseCase {
  constructor(private readonly repo: JobPostRepostory) {}

  async execute(query: GetJobPostsQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const result = await this.repo.findAll(
      {
        search: query.search,
        status: query.status,
        isBlocked: query.isBlocked !== undefined
          ? query.isBlocked === true
          : undefined,
        jobType: query.jobType,
        recruiterId: query.recruiterId,
        location: query.location,
        postedAfter: query.postedAfter,
        postedBefore: query.postedBefore,
      },
      { page, limit },
      query.sortField ?? "createdAt",
      query.includeDeleted ?? false,
    );

    return {
      jobPosts: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}