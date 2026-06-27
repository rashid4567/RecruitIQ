import { RecruiterRepository } from "../../../Domain/repositories/recruiter.repository";
import { AccountStatus } from "../../../Domain/constatns/verification.status";
import {
  GetRecruitersQuery,
  GetRecruitersResponseDTO,
} from "../../dto/recruiter.dto/get-recruiters.query";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";

export class GetRecruitersUseCase implements IUseCase<
  GetRecruitersQuery,
  GetRecruitersResponseDTO
> {
  constructor(private readonly repo: RecruiterRepository) {}

  async execute(query: GetRecruitersQuery): Promise<GetRecruitersResponseDTO> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const result = await this.repo.getRecruiters({
      search: query.search,
      verificationStatus: query.verificationStatus as AccountStatus | undefined,
      subscriptionStatus: query.subscriptionStatus,
      isActive:
        query.isActive !== undefined ? query.isActive === true : undefined,
      sort: query.sort,
      skip: (page - 1) * limit,
      limit,
    });

    return {
      recruiters: result.recruiters,
      pagination: { page, limit, total: result.total },
    };
  }
}
