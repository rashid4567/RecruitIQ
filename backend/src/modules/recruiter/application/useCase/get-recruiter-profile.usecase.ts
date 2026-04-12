import { ApplicationError } from "../../../../shared/errors/application.error";
import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { UserRepository } from "../../domain/repositories/user.entity";
import { UserId } from "../../../../shared/value-objects/userId.vo";
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

    return {
      user: {
        id: user.getId().getValue(),
        fullName: user.getFullName(),
        email: user.getEmail().getValue(),
        profileImage: user.getProfileImage(),
      },

      recruiter: {
        companyName: profile?.getCompanyName() ?? "",
        companyWebsite: profile?.getCompanyWebsite() ?? "",
        companySize: profile?.getCompanySize() ?? 0,
        industry: profile?.getIndustry() ?? "",
        designation: profile?.getDesignation() ?? "",
        location: profile?.getLocation() ?? "",
        bio: profile?.getBio() ?? "",
        linkedinUrl: profile?.getLinkedinUrl() ?? "",
        subscriptionStatus: profile?.getSubscriptionStatus() ?? "free",
        jobPostsUsed: profile?.getJobPostsUsed() ?? 0,
        verificationStatus: profile?.getVerificationStatus() ?? "pending",
      },
    };
  }
}
