import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { FileStorageRepository } from "../../../../resume/domain/repository/fileStorage.repository";
import { RecruiterRepository } from "../../../Domain/repositories/recruiter.repository";
import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import {
  RecruiterProfileOutput,
  RecruiterProfileRequestDTO,
} from "../../dto/recruiter.dto/recruiter-profile.output";

export class GetRecruiterProfileUseCase implements UseCase<
  RecruiterProfileRequestDTO,
  RecruiterProfileOutput
> {
  constructor(
    private readonly recruiterRepo: RecruiterRepository,
    private readonly fileStorageRepo: FileStorageRepository,
  ) {}

  async execute(
    request: RecruiterProfileRequestDTO,
  ): Promise<RecruiterProfileOutput> {
    const recruiter = await this.recruiterRepo.findById(request.recruiterId);

    if (!recruiter) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_PROFILE_NOT_FOUND);
    }

    const profileImageKey = recruiter.getProfileImage();
    let profileImageUrl: string | undefined;

    if (profileImageKey) {
      profileImageUrl = await this.fileStorageRepo.getViewUrl(profileImageKey);
    }

    return {
      id: recruiter.id,
      name: recruiter.name,
      email: recruiter.email,
      isActive: recruiter.isActive,
      profileImage: profileImageUrl,
      verificationStatus: recruiter.verificationStatus,
      subscriptionStatus: recruiter.subscriptionStatus ?? "free",
      jobPostsUsed: recruiter.jobPostsUsed ?? 0,
      joinedDate: recruiter.joinedDate,
      companyName: recruiter.companyName ?? "",
      companyWebsite: recruiter.companyWebsite ?? "",
      companySize: recruiter.companySize ?? 0,
      industry: recruiter.industry,
      designation: recruiter.designation,
      location: recruiter.location,
      linkedinUrl: recruiter.linkedinUrl,
      bio: recruiter.bio,
    };
  }
}
