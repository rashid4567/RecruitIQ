import {
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  FileStorageRepository,
  UploadFileParams,
} from "../../domain/repository/fileStorage.repository";

import { s3Client } from "../../../../config/s3";

export class S3FileStorageRepository implements FileStorageRepository {
  private readonly bucketName = process.env.AWS_BUCKET_NAME!;

  async uploadFile(params: UploadFileParams): Promise<void> {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: params.key,
        Body: params.buffer,
        ContentType: params.contentType,
      }),
    );
  }

  async deleteFile(key: string): Promise<void> {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }

  async getDownloadUrl(key: string, fileName?: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${
        fileName ?? "resume"
      }"`,
    });

    return getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
  }
}
