import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { Resume } from "../../domain/entity/resume.entity";
import { ResumeRepository } from "../../domain/repository/resume.repository";

export interface GetResumeByIdDTO {
  resumeId: string;
}

export class GetResumeByIdUseCase {
  constructor(private readonly resumeRepository: ResumeRepository) {}
  async execute(dto: GetResumeByIdDTO): Promise<Resume> {
    const resume = await this.resumeRepository.findById(dto.resumeId);
    if (!resume) {
      throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND);
    }

    return resume;
  }
}
