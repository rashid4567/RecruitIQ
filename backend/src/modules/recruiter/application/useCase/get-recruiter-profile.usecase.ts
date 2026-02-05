import { ApplicationError } from "../../../auth/application/errors/application.error";
import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { UserRepository } from "../../domain/repositories/user.entity";
import { UserId } from "../../../../shared/domain/value-objects.ts/userId.vo";
import { ERROR_CODES } from "../constants/error.code.constants";
import { RecruiterProfileReponse } from "../dto/recruiter-profile.dto";
import { RecruiterProfile } from "../../domain/entities/recruiter-profile.entity";

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

    let profile = await this.recruiterRepo.findByUserId(id);

    if (!profile) {
      profile = RecruiterProfile.fromPresistence({
        userId: id,
        companyName: "",
        companyWebsite: "",
        companySize: 0,
        industry: "",
        designation: "",
        location: "",
        bio: "",
        linkedinUrl: "",
        subscriptionStatus: "free",
        jobPostsUsed: 0,
        verificationStatus: "pending",
      });

      await this.recruiterRepo.save(profile);
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
        industry: profile.getIndustry(),
        designation: profile.getDesignation(),
        location: profile.getLocation(),
        bio: profile.getBio(),
        linkedinUrl: profile.getLinkedinUrl(),
        subscriptionStatus: profile.getSubscriptionStatus(),
        jobPostsUsed: profile.getJobPostsUsed(),
        verificationStatus: profile.getVerificationStatus(),
      },
    };
  }
}
