import type { JobApplication } from "../../../domain/entity/job-application.entity";
import type { JobApplicationRepository } from "../../../domain/repository/application.repository";

export class GetMyApplicationsUseCase {
  private readonly jobApplicationRepo: JobApplicationRepository;
  constructor(jobApplicationRepo: JobApplicationRepository) {
    this.jobApplicationRepo = jobApplicationRepo;
  }

  async execute(): Promise<JobApplication[]> {
    return this.jobApplicationRepo.getMyApplications();
  }
}
