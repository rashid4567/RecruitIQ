import api from "@/api/axios";
import { CANDIDATE_APPLICATION_ROUTES } from "../constants/candidate-application.routes";
import type {
  ApplicationDetailDTO,
  ApplyJobDTO,
  CandidateApplication,
  GetApplicationDetailResponse,
  GetMyApplicationsResponse,
} from "../types/application.types";
import type { JobApplication } from "../types/jobApplication.types";
import { unwrapApplication, unwrapJob } from "../mappers/application.mappers";
import type { JobApplicationResponseDTO } from "../types/job-application.response.dto";

export const applyJob = async (
  payload: ApplyJobDTO,
): Promise<JobApplication> => {
  const res = await api.post(
    CANDIDATE_APPLICATION_ROUTES.APPLY(payload.jobId),
    {
      resumeId: payload.resumeId,
      coverLetter: payload.coverLetter,
    },
  );

  return unwrapApplication(res.data.data);
};

export const getMyApplications = async (): Promise<CandidateApplication[]> => {
  const res = await api.get<GetMyApplicationsResponse>(
    CANDIDATE_APPLICATION_ROUTES.APPLICATIONS,
  );

  return res.data.data.map(
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
};

export const getApplicationById = async (
  applicationId: string,
): Promise<ApplicationDetailDTO> => {
  const res = await api.get<GetApplicationDetailResponse>(
    CANDIDATE_APPLICATION_ROUTES.APPLICATION(applicationId),
  );

  return {
    application: unwrapApplication(res.data.data.application),
    job: unwrapJob(res.data.data.job),
  };
};

export const withdrawApplication = async (
  applicationId: string,
): Promise<void> => {
  await api.patch(CANDIDATE_APPLICATION_ROUTES.WITHDRAW(applicationId));
};
