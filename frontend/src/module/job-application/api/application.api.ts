import api from "@/api/axios";

import type { Job } from "@/module/jobs/types/job.types";

import type {
  ApplyJobDTO,
  CandidateApplication,
  RecruiterApplication,
  ApplicationDetailDTO,
} from "../types/application.types";

import type {
  JobApplication,
  ApplicationAnalysisStatus,
} from "../types/jobApplication.types";

import type { UpdateApplicationStatusDTO } from "../types/updateApplicationStatus.dto";
import type { RecruiterApplicationDetails } from "../types/RecruiterApplicationDetails";

import type {
  JobApplicationResponseDTO,
  RecruiterApplicationResponseDTO,
} from "../types/job-application.response.dto";

interface GetMyApplicationsResponse {
  success: boolean;
  data: JobApplicationResponseDTO[];
}

interface GetApplicationsByJobResponse {
  success: boolean;
  data: RecruiterApplicationResponseDTO[];
}

interface GetRecruiterApplicationDetailsResponse {
  success: boolean;
  data: RecruiterApplicationDetails;
}

interface GetApplicationDetailResponse {
  success: boolean;
  data: {
    application: JobApplicationResponseDTO;
    job: Job;
  };
}

const unwrapApplication = (
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

const unwrapJob = (job: Job): Job => ({
  ...job,
  postedOn: job.postedOn ? new Date(job.postedOn) : undefined,
  expiresAt: job.expiresAt ? new Date(job.expiresAt) : undefined,
  createdAt: job.createdAt ? new Date(job.createdAt) : undefined,
  updatedAt: job.updatedAt ? new Date(job.updatedAt) : undefined,
});

export const applyJob = async (
  payload: ApplyJobDTO,
): Promise<JobApplication> => {
  const res = await api.post(`/candidate/application/${payload.jobId}/apply`, {
    resumeId: payload.resumeId,
    coverLetter: payload.coverLetter,
  });

  return unwrapApplication(res.data.data);
};

export const getMyApplications = async (): Promise<CandidateApplication[]> => {
  const res = await api.get<GetMyApplicationsResponse>(
    "/candidate/application",
  );

  const applications = res.data.data.map(
    (item: JobApplicationResponseDTO): CandidateApplication => ({
      applicationId: item.applicationId,
      jobId: item.jobId,
      jobTitle: item.jobTitle ?? "",
      resumeId: item.resumeId,
      resumeFileName: item.resumeFileName ?? "",
      status: item.status,
      appliedAt: item.appliedAt,
      rejectionReason: item.rejectionReason,
      interview: item.interview,
    }),
  );

  return applications;
};

export const getApplicationById = async (
  applicationId: string,
): Promise<ApplicationDetailDTO> => {
  const res = await api.get<GetApplicationDetailResponse>(
    `/candidate/application/${applicationId}`,
  );

  return {
    application: unwrapApplication(res.data.data.application),
    job: unwrapJob(res.data.data.job),
  };
};

export const getApplicationsByJob = async (
  jobId: string,
): Promise<RecruiterApplication[]> => {
  const res = await api.get<GetApplicationsByJobResponse>(
    `/recruiter/jobs/${jobId}/applications`,
  );

  return res.data.data.map(
    (item: RecruiterApplicationResponseDTO): RecruiterApplication => ({
      applicationId: item.applicationId,
      candidateId: item.candidateId,
      candidateName: item.candidateName,
      candidateEmail: item.candidateEmail,
      candidateProfileImage: item.candidateProfileImage,
      resumeId: item.resumeId,
      status: item.status,
      analysisStatus: item.analysisStatus,
      aiScore: item.aiScore,
      aiRecommendation: item.aiRecommendation,
      appliedAt: item.appliedAt,
    }),
  );
};

export const getRecruiterApplicationDetails = async (
  applicationId: string,
): Promise<RecruiterApplicationDetails> => {
  const res = await api.get<GetRecruiterApplicationDetailsResponse>(
    `/recruiter/jobs/applications/${applicationId}`,
  );

  return res.data.data;
};

export const updateApplicationStatus = async (
  payload: UpdateApplicationStatusDTO,
): Promise<void> => {
  await api.patch(
    `/recruiter/jobs/applications/${payload.applicationId}/status`,
    {
      status: payload.status,
      rejectionReason: payload.rejectionReason,
    },
  );
};

export const withdrawApplication = async (
  applicationId: string,
): Promise<void> => {
  await api.patch(`/candidate/application/${applicationId}/withdraw`);
};
