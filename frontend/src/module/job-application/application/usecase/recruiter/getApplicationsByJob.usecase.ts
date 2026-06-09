
import type { JobApplicationRepository, RecruiterApplication } from "@/module/job-application/domain/repository/application.repository";

export class GetApplicationsByJobUseCase {
  private readonly repository: JobApplicationRepository
  constructor(
     repository: JobApplicationRepository,
  ) {this.repository = repository}

  async execute(
    jobId: string,
  ): Promise<RecruiterApplication[]> {
    return this.repository.getApplicationsByJob(jobId);
  }
}