export interface UploadSignatureDTO {
  candidateId: string;
  offerId: string;
  fileName: string;
  fileBuffer: Buffer;
  mimeType: string;
}