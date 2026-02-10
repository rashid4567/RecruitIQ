import { CandidateRepository } from "../../../Domain/repositories/candidate.repository";
import { CandidateListItemDTO, CandidateListResponseDTO } from "../../dto/candidate-list-response.dto";


export class GetCandidateUseCase {
  constructor(
    private readonly candidateRepo: CandidateRepository
  ) {}

  async execute(query: {
    search?: string;
    limit: number;
    page: number;
    status?: boolean
  }): Promise<CandidateListResponseDTO> {

    const skip = (query.page - 1) * query.limit;

    const { candidates, total } =
      await this.candidateRepo.getCandidates({
        search: query.search,
        status: query.status,
        skip,
        limit: query.limit,
      });

    return {
      candidates: candidates.map<CandidateListItemDTO>((candidate) => ({
        id: candidate.getId(),     
        name: candidate.getName(),
        email: candidate.getEmail().getValue(),
        isActive: candidate.isActiveAccount(), 
      })),

      pagination: {
        page: query.page,
        limit: query.limit,
        total,
      },
    };
  }
}