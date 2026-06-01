import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { CandidateRepository } from "../../../candidate/domain/repositories/candidate.repository";
import { Resume } from "../../domain/entity/resume.entity";
import { FileStorageRepository } from "../../domain/repository/fileStorage.repository";
import { ResumeRepository } from "../../domain/repository/resume.repository";
import { UploadResumeDTO } from "../dto/upload.resume.dto";

export class UploadResumeUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly candidateRepository: CandidateRepository,
    private readonly fileStorageRepository: FileStorageRepository,
  ) {}

  async execute(dto: UploadResumeDTO): Promise<Resume> {
    const userId = UserId.create(dto.candidateId);
    const candidate = await this.candidateRepository.findByUserId(userId);
    if (!candidate) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }
    const existingResume = await this.resumeRepository.findByCandidateId(
      dto.candidateId,
    );
    const fileKey = `resumes/${dto.candidateId}/${Date.now()}-${dto.fileName}`;
    await this.fileStorageRepository.uploadFile({
      key: fileKey,
      buffer: dto.fileBuffer,
      contentType: dto.mimeType,
    });


    if (existingResume) {
      try {
        await this.fileStorageRepository.deleteFile(
          existingResume.getFileKey(),
        );
      } catch (error) {
        console.error("Failed to delete previous resume", error);
      }
      const updatedResume = Resume.fromPersistence({
        id: existingResume.getId()!,
        candidateId: existingResume.getCandidateId(),
        fileName: dto.fileName,
        fileKey,
        uploadedAt: new Date(),
        parsedData: undefined,
      });
      return await this.resumeRepository.update(updatedResume);
    }
    const resume = Resume.create(dto.candidateId, dto.fileName, fileKey);
    return await this.resumeRepository.create(resume);
  }
}
