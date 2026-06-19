import { BaseRepository } from "../../../../shared/repositories/base.repository";
import { Candidate } from "../entities/candidate.entity";

export interface CandidateRepository extends BaseRepository<Candidate> {
  getCandidates(input: {
    search?: string;
    status?: boolean;
    skip: number;
    limit: number;
  }): Promise<{
    candidates: Candidate[];
    total: number;
  }>;
}
