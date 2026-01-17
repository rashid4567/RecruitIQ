import { RecruiterRepository } from "../../Domain/repositories/recruiter.repository";

export class GetRecruitersUseCase {
  constructor(private readonly repo: RecruiterRepository) {}

  async execute(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const { recruiters, total } = await this.repo.getRecruiters({
      search: query.search,
      verificationStatus: query.verificationStatus,
      subscriptionStatus: query.subscriptionStatus,
      isActive:
        query.isActive !== undefined
          ? query.isActive === "true"
          : undefined,
      sort: query.sort,
      skip: (page - 1) * limit,
      limit,
    });

    return {
      recruiters,
      pagination: { page, limit, total },
    };
  }
}
