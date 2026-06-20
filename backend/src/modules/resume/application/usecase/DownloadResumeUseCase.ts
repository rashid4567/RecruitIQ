import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { FileStorageRepository } from "../../domain/repository/fileStorage.repository";
import { ResumeRepository } from "../../domain/repository/resume.repository";
import { DownloadResumeDTO } from "../dto/download.resume.dto";

export class DownloadResumeUseCase implements UseCase<
  DownloadResumeDTO,
  string
> {
  constructor(
    private readonly resumeRepo: ResumeRepository,
    private readonly fileStorageRepo: FileStorageRepository,
  ) {}

  async execute(request: DownloadResumeDTO): Promise<string> {
    const resume = await this.resumeRepo.findById(request.resumeId);
    if (!resume) {
      throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND);
    }
    return this.fileStorageRepo.getDownloadUrl(
      resume.getFileKey(),
      resume.getFileName(),
    );
  }
}
