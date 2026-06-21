import type { JobApplicationRepository } from "../../../domain/repository/application.repository";
import type { CandidateApplication } from "../../dto/candidateApplication.dto";

export class GetMyApplicationsUseCase {
  private readonly jobApplicationRepo: JobApplicationRepository;
  constructor(jobApplicationRepo: JobApplicationRepository) {
    this.jobApplicationRepo = jobApplicationRepo;
  }

  async execute(): Promise<CandidateApplication[]> {
    return this.jobApplicationRepo.getMyApplications();
  }
}
