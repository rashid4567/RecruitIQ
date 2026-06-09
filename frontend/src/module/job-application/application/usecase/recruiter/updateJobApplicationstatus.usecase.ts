import type { UpdateApplicationStatusDTO } from "@/module/job-application/domain/dto/updateApplicationStatus.dto";
import type { JobApplicationRepository } from "@/module/job-application/domain/repository/application.repository";


export class UpdateApplicationStatusUseCase {
    private readonly repository: JobApplicationRepository;
  constructor(
    repository : JobApplicationRepository
  ) {
    this.repository = repository
  }

  async execute(
    payload: UpdateApplicationStatusDTO,
  ): Promise<void> {
    await this.repository.updateStatus(payload);
  }
}