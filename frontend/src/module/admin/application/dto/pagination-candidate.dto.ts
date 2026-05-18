import type { Candidate } from "../../domain/entities/candidates.entity";

export interface PaginationCandidate {
  candidates: Candidate[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}