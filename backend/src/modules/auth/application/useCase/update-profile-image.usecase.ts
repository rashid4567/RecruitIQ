import path from "path";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { FileStorageRepository } from "../../../resume/domain/repository/fileStorage.repository";
import { UserRepository } from "../../domain/repositories/user.repository";
import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { UseCase } from "../../../../shared/interfaces/usecase.interface";
import { UpdateProfileImageRequest } from "../dto/update.profileDTO";

export class UpdateProfileImageUseCase implements UseCase<
  UpdateProfileImageRequest,
  void
> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly fileStorageRepo: FileStorageRepository,
  ) {}

  async execute({ userId, file }: UpdateProfileImageRequest): Promise<void> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    const extension = path.extname(file.originalname);
    const imageKey = `profile-images/${userId}-${Date.now()}${extension}`;
    const previousImage = user.profileImage;
    await this.fileStorageRepo.uploadFile({
      key: imageKey,
      buffer: file.buffer,
      contentType: file.mimetype,
    });

    const updatedUser = user.updateProfileImage(imageKey);
    await this.userRepo.save(updatedUser);
    if (previousImage) {
      try {
        await this.fileStorageRepo.deleteFile(previousImage);
      } catch (error) {
        console.error(
          `Failed to delete old profile image: ${previousImage}`,
          error,
        );
      }
    }
  }
}
