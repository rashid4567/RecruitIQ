export interface UploadResumeDTO {
  candidateId: string;
  fileName: string;
  fileBuffer: Buffer;
  mimeType: string;
}