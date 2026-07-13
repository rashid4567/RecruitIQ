import type { Job } from "@/module/jobs/types/job.types";
import type {
  JobApplication,
  ApplicationStatus,
  ApplicationRecommendation,
  OfferSummary,
  InterviewSummary,
} from "./jobApplication.types";
import type { RecruiterApplicationDetails } from "./RecruiterApplicationDetails";
import type { UpdateApplicationStatusDTO } from "./updateApplicationStatus.dto";
import type {
  JobApplicationResponseDTO,
  RecruiterApplicationResponseDTO,
} from "./job-application.response.dto";
import type {
  GetRecruiterApplicationsQuery,
  GetRecruiterApplicationsResult,
} from "./getRecruiterApplications.dto";

export interface ApplyJobDTO {
  jobId: string;
  resumeId: string;
  coverLetter?: string;
}

export interface CandidateApplication {
  applicationId: string;
  applicationNumber: string;
  jobId: string;
  jobTitle: string;
  resumeId: string;
  appliedResumeFileName: string;
  status: ApplicationStatus;
  appliedAt: string;
  rejectionReason?: string;
  interview?: InterviewSummary;
}

export interface RecruiterApplication {
  applicationId: string;
  applicationNumber: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  jobTitle: string;
  resumeId: string;
  appliedResumeFileName: string;
  status: ApplicationStatus;
  aiScore?: number;
  aiRecommendation?: ApplicationRecommendation;
  appliedAt: string;
}

export interface ApplicationDetailDTO {
  application: JobApplication;
  job: Job;
  offer?: OfferSummary;
}

export interface JobApplicationApi {
  apply(payload: ApplyJobDTO): Promise<JobApplication>;
  getRecruiterApplications(
    query: GetRecruiterApplicationsQuery,
  ): Promise<GetRecruiterApplicationsResult>;
  getMyApplications(): Promise<CandidateApplication[]>;
  getById(applicationId: string): Promise<ApplicationDetailDTO>;
  getApplicationsByJob(jobId: string): Promise<RecruiterApplication[]>;
  getRecruiterApplicationDetails(
    applicationId: string,
  ): Promise<RecruiterApplicationDetails>;
  withdraw(applicationId: string): Promise<void>;
  updateStatus(payload: UpdateApplicationStatusDTO): Promise<void>;
}

export interface GetMyApplicationsResponse {
  success: boolean;
  data: JobApplicationResponseDTO[];
}

export interface GetApplicationsByJobResponse {
  success: boolean;
  data: RecruiterApplicationResponseDTO[];
}

export interface GetRecruiterApplicationDetailsResponse {
  success: boolean;
  data: RecruiterApplicationDetails;
}

export interface GetApplicationDetailResponse {
  success: boolean;
  data: {
    application: JobApplicationResponseDTO;
    job: Job;
    offer?: OfferSummary;
  };
}
