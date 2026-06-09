import api from "@/api/axios";
import { JobApplication } from "../../domain/entity/job-application.entity";
import type {
  ApplicationDetailDTO,
  ApplyJobDTO,
  JobApplicationRepository,
  RecruiterApplication,
} from "../../domain/repository/application.repository";

import type { JobApplicationResponseDTO } from "../dto/job-application.response.dto";


import { Job } from "@/module/jobs/domain/entity/jobPost.entity";
import type { UpdateApplicationStatusDTO } from "../../domain/dto/updateApplicationStatus.dto";

interface GetMyApplicationsResponse {
  success: boolean;
  data: JobApplicationResponseDTO[];
}

export class ApiJobApplicationRepository
  implements JobApplicationRepository
{
  async apply(data: ApplyJobDTO): Promise<JobApplication> {
    const response = await api.post(
      `/candidate/application/${data.jobId}/apply`,
      {
        resumeId: data.resumeId,
        coverLetter: data.coverLetter,
      },
    );

    return JobApplication.create(response.data.data);
  }

  async getMyApplications(): Promise<JobApplication[]> {
    const response = await api.get<GetMyApplicationsResponse>(
      "/candidate/application",
    );

    return response.data.data.map((item) =>
      JobApplication.create({
        id: item.id,
        jobId: item.jobId,
        candidateId: item.candidateId,
        recruiterId: item.recruiterId,
        resumeId: item.resumeId,
        coverLetter: item.coverLetter,
        status: item.status,
        interview: item.interview,
        rejectionReason: item.rejectionReason,
        appliedAt: item.appliedAt,
        updatedAt: item.updatedAt,
      }),
    );
  }

  async getById(applicationId: string): Promise<ApplicationDetailDTO> {
    const response = await api.get(
      `/candidate/application/${applicationId}`,
    );

    const data = response.data.data;

    return {
      application: JobApplication.create(data.application),

      job: new Job({
        ...data.job,
        postedOn: data.job.postedOn
          ? new Date(data.job.postedOn)
          : undefined,
        expiresAt: data.job.expiresAt
          ? new Date(data.job.expiresAt)
          : undefined,
      }),
    };
  }

  async getApplicationsByJob(
    jobId: string,
  ): Promise<RecruiterApplication[]> {
    const response = await api.get(
      `/recruiter/jobs/${jobId}/applications`,
    );

    return response.data.data.map((item: any) => ({
      applicationId: item.applicationId,
      candidateId: item.candidateId,
      candidateName: item.candidateName,
      candidateEmail: item.candidateEmail,
      candidateProfileImage: item.candidateProfileImage,
      resumeId: item.resumeId,
      status: item.status,
      appliedAt: item.appliedAt,
    }));
  }
  async updateStatus(payload: UpdateApplicationStatusDTO): Promise<void> {
    await api.patch(`recruiter/jobs/applications/${payload.applicationId}/status`,{
      status : payload.status,
      rejectionReason : payload.rejectionReason,
    })
  }
  async withdraw(applicationId: string): Promise<void> {
    await api.patch(
      `/candidate/application/${applicationId}/withdraw`,
    );
  }
}