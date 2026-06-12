import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { CandidateRepository } from "../../../candidate/domain/repositories/candidate.repository";
import { Resume } from "../../domain/entity/resume.entity";
import { FileStorageRepository } from "../../domain/repository/fileStorage.repository";
import { ResumeRepository } from "../../domain/repository/resume.repository";
import { UploadResumeDTO } from "../dto/upload.resume.dto";
import { ParseResumeUseCase } from "./ParseResumeUseCase";

export class UploadResumeUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly candidateRepository: CandidateRepository,
    private readonly fileStorageRepository: FileStorageRepository,
    private readonly parseResumeUseCase: ParseResumeUseCase,
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

    const sanitizedFileName = dto.fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    const fileKey = `resumes/${dto.candidateId}/${Date.now()}-${sanitizedFileName}`;

    await this.fileStorageRepository.uploadFile({
      key: fileKey,
      buffer: dto.fileBuffer,
      contentType: dto.mimeType,
    });

    try {
      let savedResume: Resume;

      if (existingResume) {
        const updatedResume = Resume.fromPersistence({
          id: existingResume.getId()!,
          candidateId: existingResume.getCandidateId(),
          fileName: dto.fileName,
          fileKey,
          uploadedAt: new Date(),
          parsedData: undefined,
        });

        savedResume = await this.resumeRepository.update(updatedResume);

        try {
          await this.fileStorageRepository.deleteFile(
            existingResume.getFileKey(),
          );
        } catch (error) {
          console.error("Failed to delete previous resume from storage", error);
        }
      } else {
        const resume = Resume.create(dto.candidateId, dto.fileName, fileKey);

        savedResume = await this.resumeRepository.create(resume);
      }

      try {
        await this.parseResumeUseCase.execute({
          resumeId: savedResume.getId()!,
          fileBuffer: dto.fileBuffer,
          mimeType: dto.mimeType,
        });
      } catch (error) {
        console.error("Resume parsing failed:", error);
      }

      return savedResume;
    } catch (error) {
      try {
        await this.fileStorageRepository.deleteFile(fileKey);
      } catch (rollbackError) {
        console.error("Failed to rollback uploaded file", rollbackError);
      }

      throw error;
    }
  }
}
