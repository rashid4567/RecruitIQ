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

export interface RecruiterApplicationListItem {
  applicationId: string;
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
  jobId: string;
  jobTitle: string;
  resumeId: string;
  resumeFileName: string;
  status: ApplicationStatus;
  appliedAt: Date;
}
export interface RecruiterInterviewApplication {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  recruiterId: string;
  status: ApplicationStatus;
}

export interface JobApplicationRepository extends BaseRepository<JobApplication> {
  create(application: JobApplication): Promise<JobApplication>;
  save(application: JobApplication): Promise<JobApplication>;
  findByJob(jobId: string): Promise<JobApplication[]>;
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
    findRecruiterInterviewApplications(
  recruiterId: string,
  statuses: ApplicationStatus[],
): Promise<RecruiterInterviewApplication[]>;
  findByAnalysisStatus(
    recruiterId: string,
    status: ApplicationAnalysisStatus,
  ): Promise<JobApplication[]>;
}
