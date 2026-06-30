import { InterviewStatus } from "../../domain/entity/interview.entity";

export interface MarkRecruiterJoinedRequestDTO {
  interviewId: string;
  recruiterId: string;
}

export interface MarkRecruiterJoinedResponseDTO {
  id: string;
  recruiterJoinedAt?: Date;
  status: InterviewStatus;
  updatedAt?: Date;
}