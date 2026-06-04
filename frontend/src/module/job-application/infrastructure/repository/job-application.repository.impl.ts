import api from "@/api/axios";
import { JobApplication } from "../../domain/entity/job-application.entity";
import type {
  ApplyJobDTO,
  JobApplicationRepository,
} from "../../domain/repository/application.repository";

export class ApiJobApplicationRepository implements JobApplicationRepository {
  async apply(data: ApplyJobDTO): Promise<JobApplication> {
    const response = await api.post("/job-applications/apply", data);
    return JobApplication.create(response.data.data);
  }
}
