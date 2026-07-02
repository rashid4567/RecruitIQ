import type { Job } from "@/module/jobs/types/job.types";

import type {
  JobApplication,
  ApplicationAnalysisStatus,
} from "../types/jobApplication.types";

import type { JobApplicationResponseDTO } from "../types/job-application.response.dto";

export const unwrapApplication = (
  data: JobApplicationResponseDTO,
): JobApplication => ({
  id: data.applicationId,
  jobId: data.jobId,
  candidateId: data.candidateId,
  recruiterId: data.recruiterId,
  resumeId: data.resumeId,
  coverLetter: data.coverLetter,
  status: data.status,
  analysisStatus: data.analysisStatus as ApplicationAnalysisStatus,
  interview: data.interview,
  rejectionReason: data.rejectionReason,
  aiAnalysis: data.aiAnalysis,
  appliedAt: new Date(data.appliedAt),
  updatedAt: new Date(data.updatedAt),
});

export const unwrapJob = (job: Job): Job => ({
  ...job,
  postedOn: job.postedOn ? new Date(job.postedOn) : undefined,
  expiresAt: job.expiresAt ? new Date(job.expiresAt) : undefined,
  createdAt: job.createdAt ? new Date(job.createdAt) : undefined,
  updatedAt: job.updatedAt ? new Date(job.updatedAt) : undefined,
});
