import api from "@/api/axios";
import { JobApplication } from "../../domain/entity/job-application.entity";
import type {
  ApplyJobDTO,
  JobApplicationRepository,
} from "../../domain/repository/application.repository";
import type { JobApplicationResponseDTO } from "../dto/job-application.response.dto";

interface GetMyApplicationsResponse {
  success: boolean;
  data: JobApplicationResponseDTO[];
}

export class ApiJobApplicationRepository implements JobApplicationRepository {
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

  async withdraw(applicationId: string): Promise<void> {
    await api.patch(`/candidate/application/${applicationId}/withdraw`);
  }
}
