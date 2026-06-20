import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { Resume } from "../../domain/entity/resume.entity";
import { ResumeRepository } from "../../domain/repository/resume.repository";
import { GetResumeByIdDTO } from "../dto/getResumeByid.dto";

export class GetResumeByIdUseCase implements UseCase<GetResumeByIdDTO, Resume> {
  constructor(private readonly resumeRepository: ResumeRepository) {}
  async execute(dto: GetResumeByIdDTO): Promise<Resume> {
    const resume = await this.resumeRepository.findById(dto.resumeId);
    if (!resume) {
      throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND);
    }

    return resume;
  }
}
