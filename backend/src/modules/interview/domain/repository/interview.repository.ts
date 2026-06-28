import { Interview } from "../entity/interview.entity";

export interface InterviewRepository {
  create(interview : Interview):Promise<Interview>;
  save(interview: Interview): Promise<Interview>;
  findById(id: string): Promise<Interview | null>;
  findByApplicationId(applicationId: string): Promise<Interview | null>;
  findByApplicationAndRound(
    applicationId: string,
    round: number,
  ): Promise<Interview | null>;
  findByCandidate(
    candidateId: string,
    page?: number,
    limit?: number,
  ): Promise<Interview[]>;
  findByRecruiter(
    recruiterId: string,
    page?: number,
    limit?: number,
  ): Promise<Interview[]>;
  findUpcomingByCandidate(candidateId: string): Promise<Interview[]>;
  findUpcomingByRecruiter(recruiterId: string): Promise<Interview[]>;
  findScheduledInterviewsBefore(scheduledBefore: Date): Promise<Interview[]>;
  delete(id: string): Promise<void>;
}
