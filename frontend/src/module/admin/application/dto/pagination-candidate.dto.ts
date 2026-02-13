import type { Candidate } from "../../domain/entities/candidates.entity";

export interface PaginationCandidate {
  candidates: Candidate[];
  total: number;
}
