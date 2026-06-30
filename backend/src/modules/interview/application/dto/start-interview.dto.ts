import { InterviewStatus } from "../../domain/entity/interview.entity";

export interface StartInterviewRequestDTO {
  interviewId: string;
  recruiterId: string;
}

export interface StartInterviewResponseDTO {
  id: string;
  status: InterviewStatus;
  startedAt?: Date;
  updatedAt?: Date;
}