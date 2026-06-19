import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { Resume } from "../../domain/entity/resume.entity";
import { ResumeRepository } from "../../domain/repository/resume.repository";
import { GetResumeByCandidateDTO } from "../dto/get-resume-by-candidate.dto";

export class GetResumeByCandidateUseCase implements UseCase<
  GetResumeByCandidateDTO,
  Resume
> {
  constructor(private readonly resumeRepository: ResumeRepository) {}
  async execute(dto: GetResumeByCandidateDTO): Promise<Resume> {
    const resume = await this.resumeRepository.findByCandidateId(
      dto.candidateId,
    );

    if (!resume) {
      throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND);
    }

    return resume;
  }
}
