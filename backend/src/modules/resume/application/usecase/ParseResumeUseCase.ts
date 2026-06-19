import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import {
  ParsedResumeData,
  ResumeParseStatus,
} from "../../domain/entity/resume.entity";
import { ResumeRepository } from "../../domain/repository/resume.repository";
import { ResumeParser } from "../../domain/repository/resumeParser.repository";
import { ResumeTextExtractor } from "../../domain/service/resumeTextExtractor.service";
import { ParseResumeDTO } from "../dto/parse.resume.dto";
import { JobApplicationRepository } from "../../../job-application/domain/repository/job-application.repository";
import { AnalyzeApplicationUseCase } from "../../../job-application/application/usecase/candidate/AnalyzeApplicationUseCase";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";

export class ParseResumeUseCase implements UseCase<
  ParseResumeDTO,
  ParsedResumeData
> {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly resumeTextExtractor: ResumeTextExtractor,
    private readonly resumeParser: ResumeParser,
    private readonly applicationRepository: JobApplicationRepository,
    private readonly analyzeApplicationUC: AnalyzeApplicationUseCase,
  ) {}

  async execute(dto: ParseResumeDTO): Promise<ParsedResumeData> {
    const resume = await this.resumeRepository.findById(dto.resumeId);
    if (!resume) {
      throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND);
    }
    await this.resumeRepository.updateParseStatus(
      dto.resumeId,
      ResumeParseStatus.PROCESSING,
    );
    try {
      const extractedText = await this.resumeTextExtractor.extractText(
        dto.fileBuffer,
        dto.mimeType,
      );

      if (!extractedText.trim()) {
        throw new ApplicationError(ERROR_CODES.RESUME_TEXT_EXTRACTION_FAILD);
      }
      const parsedData = await this.resumeParser.parse(extractedText);
      await this.resumeRepository.updateParsedData(dto.resumeId, parsedData);
      await this.triggerPendingApplicationAnalysis(dto.resumeId);
      return parsedData;
    } catch (error) {
      await this.resumeRepository.updateParseStatus(
        dto.resumeId,
        ResumeParseStatus.FAILED,
      );
      throw error;
    }
  }

  private async triggerPendingApplicationAnalysis(
    resumeId: string,
  ): Promise<void> {
    const applications =
      await this.applicationRepository.findByResumeId(resumeId);
    for (const application of applications) {
      void this.analyzeApplicationUC
        .execute({ applicationId: application.id! })
        .catch((error: unknown) =>
          console.error(
            `Failed to analyze application ${application.id}`,
            error,
          ),
        );
    }
  }
}
