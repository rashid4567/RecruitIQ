import type { Job } from "@/module/jobs/types/job.types";
import type {
  JobApplication,
  ApplicationStatus,
  ApplicationAnalysisStatus,
  ApplicationRecommendation,
  InterviewInfo,
} from "./jobApplication.types";
import type { RecruiterApplicationDetails } from "./RecruiterApplicationDetails";
import type { UpdateApplicationStatusDTO } from "./updateApplicationStatus.dto";

export interface ApplyJobDTO {
  jobId: string;
  resumeId: string;
  coverLetter?: string;
}

export interface CandidateApplication {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  resumeId: string;
  resumeFileName: string;
  status: ApplicationStatus;
  appliedAt: string;
  rejectionReason?: string;
  interview?: InterviewInfo;
}

export interface RecruiterApplication {
  applicationId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateProfileImage?: string;
  resumeId: string;
  status: ApplicationStatus;
  analysisStatus: ApplicationAnalysisStatus;
  aiScore?: number;
  aiRecommendation?: ApplicationRecommendation;
  appliedAt: string;
}

export interface ApplicationDetailDTO {
  application: JobApplication;

  job: Job;
}

export interface JobApplicationApi {
  apply(payload: ApplyJobDTO): Promise<JobApplication>;
  getMyApplications(): Promise<CandidateApplication[]>;
  getById(applicationId: string): Promise<ApplicationDetailDTO>;
  getApplicationsByJob(jobId: string): Promise<RecruiterApplication[]>;
  getRecruiterApplicationDetails(
    applicationId: string,
  ): Promise<RecruiterApplicationDetails>;
  withdraw(applicationId: string): Promise<void>;
  updateStatus(payload: UpdateApplicationStatusDTO): Promise<void>;
}
