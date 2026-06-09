export interface UploadFileParams {
  key: string;
  buffer: Buffer;
  contentType: string;
}

export interface FileStorageRepository {
  uploadFile(params: UploadFileParams): Promise<void>;
  deleteFile(key: string): Promise<void>;
  getDownloadUrl(key: string, fileName ?: string): Promise<string>;
  getViewUrl(key: string): Promise<string>;
}
