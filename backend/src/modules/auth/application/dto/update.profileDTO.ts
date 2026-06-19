export interface UpdateProfileImageRequest {
  userId: string;
  file: Express.Multer.File;
}