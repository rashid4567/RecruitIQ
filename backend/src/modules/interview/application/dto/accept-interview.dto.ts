import { CandidateResponseStatus } from "../../domain/entity/interview.entity";

export interface AcceptInterviewRequestDTO {
  interviewId: string;
  candidateId: string;
}

export interface AcceptInterviewResponseDTO {
  id: string;
  candidateResponseStatus: CandidateResponseStatus;
  candidateRespondedAt?: Date;
  updatedAt?: Date;
}