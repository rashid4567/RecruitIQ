import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { JobApplicationRepository } from "../../../job-application/domain/repository/job-application.repository";
import { FileStorageRepository } from "../../domain/repository/fileStorage.repository";
import { ResumeRepository } from "../../domain/repository/resume.repository";
import { DeleteResumeDTO } from "../dto/delete-resume.dto";

export class DeleteResumeUseCase
  implements IUseCase<DeleteResumeDTO, void>
{
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly fileStorageRepository: FileStorageRepository,
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  async execute(dto: DeleteResumeDTO): Promise<void> {
    const resume = await this.resumeRepository.findById(dto.resumeId);

    if (!resume) {
      throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND);
    }

    const applications =
      await this.jobApplicationRepository.findByResumeId(dto.resumeId);

    if (applications.length > 0) {
      throw new ApplicationError(
        ERROR_CODES.CANNOT_DELETE_APPLIED_RESUME,
      );
    }

    try {
      await this.fileStorageRepository.deleteFile(resume.getFileKey());
    } catch (error) {
      console.error("Failed to delete file from S3", error);
    }

    await this.resumeRepository.delete(dto.resumeId);
  }
}