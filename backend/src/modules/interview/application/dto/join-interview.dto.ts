import { InterviewStatus } from "../../domain/entity/interview.entity";

export interface JoinInterviewRequestDTO {
  interviewId: string;
  candidateId: string;
}

export interface JoinInterviewResponseDTO {
  id: string;
  roomId?: string;
  status: InterviewStatus;
  candidateJoinedAt?: Date;
  updatedAt?: Date;
}