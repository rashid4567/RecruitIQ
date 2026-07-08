import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { CandidateRepository } from "../../../Domain/repositories/candidate.repository";
import {
  CandidateListItemDTO,
  CandidateListRequestDTO,
  CandidateListResponseDTO,
} from "../../dto/candidate.dto/candidate-list-response.dto";

export class GetCandidateUseCase implements IUseCase<
  CandidateListRequestDTO,
  CandidateListResponseDTO
> {
  constructor(private readonly candidateRepo: CandidateRepository) {}

  async execute(
    query: CandidateListRequestDTO,
  ): Promise<CandidateListResponseDTO> {
    const skip = (query.page - 1) * query.limit;

    const { candidates, total } = await this.candidateRepo.getCandidates({
      search: query.search,
      status: query.status,
      skip,
      limit: query.limit,
    });

    return {
      candidates: candidates.map<CandidateListItemDTO>((candidate) => ({
        id: candidate.getId().getValue(),
        name: candidate.getName(),
        email: candidate.getEmail().getValue(),
        isActive: candidate.isActiveAccount(),
        joinedDate: candidate.getJoinedDate(),
        skills: candidate.getSkills(),
        preferredJobLocations: candidate.getPreferredJobLocations(),
      })),

      pagination: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }
}
