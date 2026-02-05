
import { UserId } from "../../../../../shared/domain/value-objects.ts/userId.vo";
import { Candidate } from "../entities/candidate.entity";


export interface CandidateRepository {
  getCandidates(input: {
    search?: string;
    status?: boolean;
    skip: number;
    limit: number;
  }): Promise<{
    candidates: Candidate[];
    total: number;
  }>;

  findById(candidateId: string): Promise<Candidate | null>;
}
