import type { GetCandidatesQuery } from "../../application/dto/get-candidates.query";
import type { PaginationCandidate } from "../../application/dto/pagination-candidate.dto";
import type { Candidate } from "../entities/candidates.entity";

export interface CandidateRepository {

  getCandidates(
    query: GetCandidatesQuery
  ): Promise<PaginationCandidate>;

  getProfile(candidateId: string): Promise<Candidate>;

 
  blockCandidate(candidateId: string): Promise<void>;
  unblockCandidate(candidateId: string): Promise<void>;
}
