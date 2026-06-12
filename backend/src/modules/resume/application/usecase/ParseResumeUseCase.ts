import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { ParsedResumeData } from "../../domain/entity/resume.entity";
import { ResumeRepository } from "../../domain/repository/resume.repository";
import { ResumeParser } from "../../domain/repository/resumeParser.repository";
import { ResumeTextExtractor } from "../../domain/service/resumeTextExtractor.service";
import { ParseResumeDTO } from "../dto/parse.resume.dto";

export class ParseResumeUseCase {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly resumeTextExtractor: ResumeTextExtractor,
    private readonly resumeParser: ResumeParser,
  ) {}

  async execute(dto: ParseResumeDTO): Promise<ParsedResumeData> {
    const resume = await this.resumeRepository.findById(dto.resumeId);

    if (!resume) {
      throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND);
    }
    const extractedText = await this.resumeTextExtractor.extractText(
      dto.fileBuffer,
      dto.mimeType,
    );

    if (!extractedText.trim()) {
      throw new ApplicationError(ERROR_CODES.RESUME_TEXT_EXTRACTION_FAILD);
    }
    const parsedData = await this.resumeParser.parse(extractedText);
    await this.resumeRepository.updateParsedData(dto.resumeId, parsedData);
    return parsedData;
  }
}
