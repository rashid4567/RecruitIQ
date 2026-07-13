import api from "@/api/axios";
import { RECRUITER_APPLICATION_ROUTES } from "../constants/recruiter-application.routes";
import type {
  GetApplicationsByJobResponse,
  GetRecruiterApplicationDetailsResponse,
  RecruiterApplication,
} from "../types/application.types";
import type { RecruiterApplicationDetails } from "../types/RecruiterApplicationDetails";
import type { UpdateApplicationStatusDTO } from "../types/updateApplicationStatus.dto";
import type {
  GetRecruiterApplicationsQuery,
  GetRecruiterApplicationsResponse,
  GetRecruiterApplicationsResult,
} from "../types/getRecruiterApplications.dto";

export const getRecruiterApplications = async (
  query: GetRecruiterApplicationsQuery,
): Promise<GetRecruiterApplicationsResult> => {
  const res = await api.get<GetRecruiterApplicationsResponse>(
    RECRUITER_APPLICATION_ROUTES.ALL_APPLICATIONS,
    {
      params: query,
    },
  );


  return {
    applications: res.data.data.applications.map(
      (item): RecruiterApplication => ({
        applicationId: item.applicationId,
        applicationNumber: item.applicationNumber,
        candidateId: item.candidateId,
        candidateName: item.candidateName,
        candidateEmail: item.candidateEmail,
        candidateProfileImage: item.candidateProfileImage,
        jobTitle: item.jobTitle,
        resumeId: item.resumeId,
        appliedResumeFileName : item.appliedResumeFileName ?? "",
        status: item.status,
        aiScore: item.aiScore,
        aiRecommendation: item.aiRecommendation,
        appliedAt: item.appliedAt,
      }),
    ),

    pagination: res.data.data.pagination,
  };
};

export const getApplicationsByJob = async (
  jobId: string,
): Promise<RecruiterApplication[]> => {
  const res = await api.get<GetApplicationsByJobResponse>(
    RECRUITER_APPLICATION_ROUTES.JOB_APPLICATIONS(jobId),
  );

  const result =  res.data.data.map(
    (item): RecruiterApplication => ({
      applicationId: item.applicationId,
      applicationNumber: item.applicationNumber,
      candidateId: item.candidateId,
      candidateName: item.candidateName,
      candidateEmail: item.candidateEmail,
      candidateProfileImage: item.candidateProfileImage,
      jobTitle: item.jobTitle,
      resumeId: item.resumeId,
      appliedResumeFileName : item.appliedResumeFileName ,
      status: item.status,
      aiScore: item.aiScore,
      aiRecommendation: item.aiRecommendation,
      appliedAt: item.appliedAt,
    }),
  );

    return result
};

export const getRecruiterApplicationDetails = async (
  applicationId: string,
): Promise<RecruiterApplicationDetails> => {
  const res = await api.get<GetRecruiterApplicationDetailsResponse>(
    RECRUITER_APPLICATION_ROUTES.APPLICATION(applicationId),
  );

  return res.data.data;
};

export const updateApplicationStatus = async (
  payload: UpdateApplicationStatusDTO,
): Promise<void> => {
  await api.patch(
    RECRUITER_APPLICATION_ROUTES.UPDATE_STATUS(payload.applicationId),
    {
      status: payload.status,
      rejectionReason: payload.rejectionReason,
    },
  );
};
