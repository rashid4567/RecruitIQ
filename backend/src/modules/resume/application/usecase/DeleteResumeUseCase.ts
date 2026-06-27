import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { IUseCase } from "../../../../shared/interfaces/usecase.interface";
import { FileStorageRepository } from "../../domain/repository/fileStorage.repository";
import { ResumeRepository } from "../../domain/repository/resume.repository";
import { DeleteResumeDTO } from "../dto/delete-resume.dto";

export class DeleteResumeUseCase implements IUseCase<DeleteResumeDTO,void>{
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly fileStorageRepository: FileStorageRepository,
  ) {}

  async execute(dto: DeleteResumeDTO): Promise<void> {
    const resume = await this.resumeRepository.findById(dto.resumeId);

    if (!resume) {
      throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND);
    }

    try {
      await this.fileStorageRepository.deleteFile(resume.getFileKey());
    } catch (error) {
      console.error("Failed to delete file from S3", error);
    }

    await this.resumeRepository.delete(dto.resumeId);
  }
}
