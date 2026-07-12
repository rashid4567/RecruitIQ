import {
  ApplicationAIAnalysis,
  ApplicationAnalysisStatus,
  ApplicationRecommendation,
  JobApplication,
} from "../entity/job-application.entity";
import {
  ApplicationStatus,
  InterviewInfo,
} from "../../domain/entity/job-application.entity";
import { BaseRepository } from "../../../../shared/repositories/base.repository";
import { GetRecruiterApplicationsRequestDTO } from "../../application/dto/getRecrruiterApplication.dto";

export interface RecruiterApplicationListItem {
  applicationId: string;
  applicationNumber: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  Jobtitle: string;
  candidateProfileImage?: string;
  resumeId: string;
  fileName: string;
  status: ApplicationStatus;
  aiScore?: number;
  aiRecommendation?: ApplicationRecommendation;
  appliedAt: Date;
  interview?: InterviewInfo;
}

export interface RecruiterApplicationDetailsOutput {
  applicationId: string;
  applicationNumber: string;
  jobId: string;
  candidateId: string;
  recruiterId: string;
  resumeId: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateProfileImage?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  analysisStatus: ApplicationAnalysisStatus;
  interview?: InterviewInfo;
  rejectionReason?: string;
  aiAnalysis?: ApplicationAIAnalysis;
  appliedAt: Date;
  updatedAt: Date;
}

export interface CandidateApplicationListItem {
  applicationId: string;
  applicationNumber: string;
  jobId: string;
  jobTitle: string;
  resumeId: string;
  resumeFileName: string;
  status: ApplicationStatus;
  appliedAt: Date;
}
export interface RecruiterInterviewApplication {
  applicationId: string;
  applicationNumber: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  recruiterId: string;
  status: ApplicationStatus;
}

export interface RecruiterApplicationsQuery {
  recruiterId: string;
  page: number;
  limit: number;
  search?: string;
  status?: ApplicationStatus;
  recommendation?: ApplicationRecommendation;
  sortBy?: "appliedAt" | "candidateName" | "aiScore";
  sortOrder?: "asc" | "desc";
}

export interface RecruiterApplicationsResult {
  applications: RecruiterApplicationListItem[];
  total: number;
}
export interface JobApplicationRepository extends BaseRepository<JobApplication> {
  create(application: JobApplication): Promise<JobApplication>;
  save(application: JobApplication): Promise<JobApplication>;
  findByJob(jobId: string): Promise<JobApplication[]>;
  findAll(): Promise<JobApplication[]>;
  findRecruiterApplications(
    query: GetRecruiterApplicationsRequestDTO,
  ): Promise<{
    applications: RecruiterApplicationListItem[];
    total: number;
  }>;
  findApplicationsWithCandidateDetails(
    jobId: string,
  ): Promise<RecruiterApplicationListItem[]>;
  findByCandidate(candidateId: string): Promise<JobApplication[]>;
  findByRecruiter(recruiterId: string): Promise<JobApplication[]>;
  findExistingApplication(
    candidateId: string,
    jobId: string,
  ): Promise<JobApplication | null>;
  findApplicationDetailsForRecruiter(
    applicationId: string,
  ): Promise<RecruiterApplicationDetailsOutput | null>;
  findApplicationsForCandidate(
    candidateId: string,
  ): Promise<CandidateApplicationListItem[]>;
  findByResumeId(resumeId: string): Promise<JobApplication[]>;
  countTodayApplicationsByCandidate(candidateId: string): Promise<number>;
  findByRecruiterAndStatuses(
    recruiterId: string,
    statuses: ApplicationStatus[],
  ): Promise<JobApplication[]>;
findRecruiterApplications(
  query: RecruiterApplicationsQuery,
): Promise<RecruiterApplicationsResult>;
  findByAnalysisStatus(
    recruiterId: string,
    status: ApplicationAnalysisStatus,
  ): Promise<JobApplication[]>;
}
