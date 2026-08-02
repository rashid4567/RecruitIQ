import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { IUseCase } from "../../../../../shared/interfaces/usecase.interface";
import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { CandidateRepository } from "../../../../candidate/domain/repositories/candidate.repository";
import { FileStorageRepository } from "../../../../resume/domain/repository/fileStorage.repository";
import { UploadSignatureDTO } from "../../dto/uploadSignature.dto";

export class UploadSignatureUseCase implements IUseCase<
  UploadSignatureDTO,
  string
> {
  constructor(
    private readonly candidateRepository: CandidateRepository,
    private readonly fileStorageRepository: FileStorageRepository,
  ) {}

  async execute(dto: UploadSignatureDTO): Promise<string> {
    await this.validateCandidate(dto.candidateId);

    const fileKey = this.generateFileKey(
      dto.offerId,
      dto.candidateId,
      dto.fileName,
    );

    await this.fileStorageRepository.uploadFile({
      key: fileKey,
      buffer: dto.fileBuffer,
      contentType: dto.mimeType,
    });

    return await this.fileStorageRepository.getViewUrl(fileKey);
  }

  private async validateCandidate(candidateId: string): Promise<void> {
    const candidate = await this.candidateRepository.findByUserId(
      UserId.create(candidateId),
    );

    if (!candidate) {
      throw new ApplicationError(ERROR_CODES.CANDIDATE_NOT_FOUND);
    }
  }

  private generateFileKey(
    offerId: string,
    candidateId: string,
    fileName: string,
  ): string {
    const sanitized = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    return `signatures/${offerId}/${candidateId}-${Date.now()}-${sanitized}`;
  }
}
