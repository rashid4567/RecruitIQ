import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export class ResumeTextExtractorService {
  async extractText(
    buffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    if (mimeType === "application/pdf") {
      const result = await pdfParse(buffer);
      return result.text;
    }

    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        buffer,
      });

      return result.value;
    }

    throw new Error("Unsupported file format");
  }
}