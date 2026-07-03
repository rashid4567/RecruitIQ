import api from "@/api/axios";
import { RECRUITER_APPLICATION_ROUTES } from "../constants/recruiter-application.routes";
import type {
  GetApplicationsByJobResponse,
  GetRecruiterApplicationDetailsResponse,
  RecruiterApplication,
} from "../types/application.types";
import type { RecruiterApplicationResponseDTO } from "../types/job-application.response.dto";
import type { RecruiterApplicationDetails } from "../types/RecruiterApplicationDetails";
import type { UpdateApplicationStatusDTO } from "../types/updateApplicationStatus.dto";

export const getApplicationsByJob = async (
  jobId: string,
): Promise<RecruiterApplication[]> => {
  const res = await api.get<GetApplicationsByJobResponse>(
    RECRUITER_APPLICATION_ROUTES.JOB_APPLICATIONS(jobId),
  );

  return res.data.data.map(
    (item: RecruiterApplicationResponseDTO): RecruiterApplication => ({
      applicationId: item.applicationId,
      applicationNumber : item.applicationNumber,
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
