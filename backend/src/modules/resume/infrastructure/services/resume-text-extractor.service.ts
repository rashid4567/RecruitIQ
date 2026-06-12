import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export class ResumeTextExtractorService {
  private static readonly PDF_MIME_TYPE = "application/pdf";
  private static readonly DOCX_MIME_TYPE =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  private static readonly MAX_TEXT_LENGTH = 30000;
  async extractText(buffer: Buffer, mimeType: string): Promise<string> {
    try {
      let extractedText = "";

      switch (mimeType) {
        case ResumeTextExtractorService.PDF_MIME_TYPE: {
          const parser = new PDFParse({
            data: buffer,
          });

          try {
            const result = await parser.getText();
            extractedText = result.text;
          } finally {
            await parser.destroy();
          }
          break;
        }
        case ResumeTextExtractorService.DOCX_MIME_TYPE: {
          const result = await mammoth.extractRawText({
            buffer,
          });
          extractedText = result.value;
          break;
        }
        default:
          throw new Error(`Unsupported resume format: ${mimeType}`);
      }
      const normalizedText = this.normalizeText(extractedText);
      if (!normalizedText) {
        throw new Error("No readable text found in the uploaded resume");
      }
      return normalizedText.slice(
        0,
        ResumeTextExtractorService.MAX_TEXT_LENGTH,
      );
    } catch (error) {
      console.error("Resume text extraction failed:", error);
      throw new Error("Failed to extract text from resume");
    }
  }
  private normalizeText(text: string): string {
    return text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\t/g, " ")
      .replace(/[ ]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
}
