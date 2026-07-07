import {
  ApplicationAIAnalysis,
  ApplicationAnalysisStatus,
  ApplicationStatus,
} from "../../../job-application/domain/entity/job-application.entity";

import {
  CandidateResponseStatus,
  InterviewMode,
  InterviewStatus,
} from "../../domain/entity/interview.entity";

import { ParsedResumeData, ResumeParseStatus } from "../../../resume/domain/entity/resume.entity";

export interface GetRecruiterHiringDecisionDetailsRequestDTO {
  interviewId: string;
  recruiterId: string;
}

export interface RecruiterHiringDecisionDetailsResponseDTO {
  application: RecruiterDecisionApplicationDTO;
  interview: RecruiterDecisionInterviewDTO;
  job: RecruiterDecisionJobDTO;
  resume: RecruiterDecisionResumeDTO;
}

export interface RecruiterDecisionApplicationDTO {
  applicationId: string;
  applicationNumber: string;
  jobId: string;
  recruiterId: string;
  candidateId: string;
  resumeId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  status: ApplicationStatus;
  analysisStatus: ApplicationAnalysisStatus;
  coverLetter?: string;
  rejectionReason?: string;
  aiAnalysis?: ApplicationAIAnalysis;
  appliedAt: Date;
  updatedAt: Date;
}

export interface RecruiterDecisionInterviewDTO {
  interviewId: string;
  title: string;
  description?: string;
  round: number;
  mode: InterviewMode;
  status: InterviewStatus;
  candidateResponseStatus: CandidateResponseStatus;
  scheduledAt: Date;
  durationInMinutes: number;
  location?: string;
  startedAt?: Date;
  endedAt?: Date;
  recruiterJoinedAt?: Date;
  candidateJoinedAt?: Date;
  notes?: string;
  completed: boolean;
}

export interface RecruiterDecisionJobDTO {
  jobId: string;
  title: string;
}

export interface RecruiterDecisionResumeDTO {
  resumeId: string;
  fileName: string;
  previewUrl: string;
  uploadedAt: Date;
  parseStatus: ResumeParseStatus;
  parsedData?: ParsedResumeData;
}