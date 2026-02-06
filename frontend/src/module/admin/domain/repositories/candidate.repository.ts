import type { GetCandidatesQuery } from "../../application/dto/get-candidates.query";
import type { PaginationCandidate } from "../../application/dto/pagination-candidate.dto";



export interface CandidateRepository{
    getCandidates(
        query : GetCandidatesQuery
    ):Promise<PaginationCandidate>;

    blockCandidate(candidateId : string):Promise<void>;
    unblockCandidate(candidateId : string):Promise<void>
}