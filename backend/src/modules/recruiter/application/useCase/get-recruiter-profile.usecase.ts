import { ApplicationError } from "../../../auth/application/errors/application.error";
import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { UserRepository } from "../../domain/repositories/user.entity";
import { UserId } from "../../domain/value.object.ts/user-Id.vo";
import { ERROR_CODES } from "../constants/error.code.constants";
import { RecruiterProfileReponse } from "../dto/recruiter-profile.dto";

export class GetRecruiterProfileUseCase {
  constructor(
    private readonly recruiterRepo: RecruiterProfileRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string): Promise<RecruiterProfileReponse> {
    const id = UserId.create(userId);

    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }

    const profile = await this.recruiterRepo.findByUserId(id);
    if (!profile) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_PROFILE_NOT_FOUND);
    }

    return {
      user: {
        id: user.getId().getValue(),
        fullName: user.getFullName(),
        email: user.getEmail().getValue(),
        profileImage: user.getProfileImage(),
      },
      recruiter: {
        companyName: profile.getCompanyName(),
        companyWebsite: profile.getCompanyWebsite(),
        companySize: profile.getCompanySize(),
        designation: profile.getDesignation(),
        industry: profile.getIndustry(),
        bio: profile.getBio(),
        subscriptionStatus: profile.getSubscriptionStatus(),
        jobPostsUsed: profile.getJobPostsUsed(),
        verificationStatus: profile.getVerificationStatus(),
      },
    };
  }
}
