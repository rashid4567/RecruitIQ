import { CandidateResponseStatus } from "../../domain/entity/interview.entity";

export interface RejectInterviewRequestDTO {
  interviewId: string;
  candidateId: string;
  reason?: string;
}

export interface RejectInterviewResponseDTO {
  id: string;
  candidateResponseStatus: CandidateResponseStatus;
  candidateRespondedAt?: Date;
  candidateResponseMessage?: string;
  updatedAt?: Date;
}