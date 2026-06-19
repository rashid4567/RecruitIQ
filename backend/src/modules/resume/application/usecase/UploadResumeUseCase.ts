import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { CandidateRepository } from "../../../candidate/domain/repositories/candidate.repository";
import { Resume, ResumeParseStatus } from "../../domain/entity/resume.entity";
import { FileStorageRepository } from "../../domain/repository/fileStorage.repository";
import { ResumeRepository } from "../../domain/repository/resume.repository";
import { UploadResumeDTO } from "../dto/upload.resume.dto";
import { ParseResumeUseCase } from "./ParseResumeUseCase";

export class UploadResumeUseCase implements UseCase<UploadResumeDTO, Resume> {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly candidateRepository: CandidateRepository,
    private readonly fileStorageRepository: FileStorageRepository,
    private readonly parseResumeUseCase: ParseResumeUseCase,
  ) {}

  async execute(dto: UploadResumeDTO): Promise<Resume> {
    await this.validateCandidate(dto.candidateId);
    const existingResume = await this.resumeRepository.findByCandidateId(
      dto.candidateId,
    );

    const fileKey = this.generateFileKey(dto.candidateId, dto.fileName);
    await this.fileStorageRepository.uploadFile({
      key: fileKey,
      buffer: dto.fileBuffer,
      contentType: dto.mimeType,
    });

    try {
      const savedResume = existingResume
        ? await this.updateExistingResume(existingResume, dto, fileKey)
        : await this.createNewResume(dto, fileKey);

      this.parseResumeAsync(savedResume.getId()!, dto.fileBuffer, dto.mimeType);

      return savedResume;
    } catch (error) {
      await this.rollbackUploadedFile(fileKey);

      throw error;
    }
  }

  private async validateCandidate(candidateId: string): Promise<void> {
    const userId = UserId.create(candidateId);
    const candidate = await this.candidateRepository.findByUserId(userId);
    if (!candidate) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }
  }

  private generateFileKey(candidateId: string, fileName: string): string {
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    return `resumes/${candidateId}/${Date.now()}-${sanitizedFileName}`;
  }

  private async createNewResume(
    dto: UploadResumeDTO,
    fileKey: string,
  ): Promise<Resume> {
    const resume = Resume.create(dto.candidateId, dto.fileName, fileKey);
    return this.resumeRepository.create(resume);
  }

  private async updateExistingResume(
    existingResume: Resume,
    dto: UploadResumeDTO,
    fileKey: string,
  ): Promise<Resume> {
    const updatedResume = Resume.fromPersistence({
      id: existingResume.getId()!,
      candidateId: existingResume.getCandidateId(),
      fileName: dto.fileName,
      fileKey,
      uploadedAt: new Date(),
      parseStatus: ResumeParseStatus.PENDING,
      parsedData: undefined,
    });

    const savedResume = await this.resumeRepository.update(updatedResume);
    this.deleteOldResumeFile(existingResume.getFileKey());
    return savedResume;
  }

  private deleteOldResumeFile(oldFileKey: string): void {
    void this.fileStorageRepository
      .deleteFile(oldFileKey)
      .catch((error) =>
        console.error("Failed to delete previous resume", error),
      );
  }

  private parseResumeAsync(
    resumeId: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): void {
    void this.parseResumeUseCase
      .execute({
        resumeId,
        fileBuffer,
        mimeType,
      })
      .catch((error) => console.error("Resume parsing failed:", error));
  }

  private async rollbackUploadedFile(fileKey: string): Promise<void> {
    try {
      await this.fileStorageRepository.deleteFile(fileKey);
    } catch (rollbackError) {
      console.error("Failed to rollback uploaded file", rollbackError);
    }
  }
}
