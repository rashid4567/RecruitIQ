import { ApplicationStatus } from "../../../job-application/domain/entity/job-application.entity";
import {
  InterviewStatus,
} from "../../domain/entity/interview.entity";

export interface GetRecruiterInterviewsRequestDTO {
  recruiterId: string;
  page?: number;
  limit?: number;
}

export interface GetRecruiterInterviewsResponseDTO {
  interviewId?: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  recruiterId: string;
   roomId?: string;
  applicationStatus: ApplicationStatus;
  interviewStatus?: InterviewStatus;
  title?: string;
  round?: number;
  scheduledAt?: Date;
  durationInMinutes?: number;
  location?: string;
  meetingLink?: string;
}