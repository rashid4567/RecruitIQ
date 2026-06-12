export interface ResumeTextExtractor {
  extractText(
    buffer: Buffer,
    mimeType: string,
  ): Promise<string>;
}