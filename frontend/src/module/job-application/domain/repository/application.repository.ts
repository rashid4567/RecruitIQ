import type { Job } from "@/module/jobs/domain/entity/jobPost.entity";
import {
  ApplicationAnalysisStatus,
  ApplicationRecommendation,
  ApplicationStatus,
  JobApplication,
} from "../entity/job-application.entity";

import type { UpdateApplicationStatusDTO } from "../dto/updateApplicationStatus.dto";
import type { RecruiterApplicationDetails } from "../dto/RecruiterApplicationDetails";

export interface ApplyJobDTO {
  jobId: string;
  resumeId: string;
  coverLetter?: string;
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
export interface CandidateApplication {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  resumeId: string;
  resumeFileName: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface JobApplicationRepository {
  apply(data: ApplyJobDTO): Promise<JobApplication>;
  getMyApplications(): Promise<CandidateApplication[]>;
  getApplicationsByJob(jobId: string): Promise<RecruiterApplication[]>;
  getApplicationDetailsForRecruiter(
    applicationId: string,
  ): Promise<RecruiterApplicationDetails>;
  getById(applicationId: string): Promise<ApplicationDetailDTO>;
  withdraw(applicationId: string): Promise<void>;
  updateStatus(payload: UpdateApplicationStatusDTO): Promise<void>;
}
