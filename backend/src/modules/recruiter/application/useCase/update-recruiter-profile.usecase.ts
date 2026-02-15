import { ApplicationError } from "../../../auth/application/errors/application.error";
import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { UserRepository } from "../../domain/repositories/user.entity";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { ERROR_CODES } from "../constants/error.code.constants";
import { RecruiterProfileReponse } from "../dto/recruiter-profile.dto";
import { UpdateRecruiterProfileDTO } from "../dto/update-recruiter-profile.dto";
import { RecruiterProfile } from "../../domain/entities/recruiter-profile.entity";

export class UpdateRecruiterProfileUseCase {
  constructor(
    private readonly recruiterRepo: RecruiterProfileRepository,
    private readonly userRepo: UserRepository
  ) {}

  async execute(
    userId: string,
    input: UpdateRecruiterProfileDTO
  ): Promise<RecruiterProfileReponse> {

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
    }


    if (input.fullName !== undefined) {
      user.updateFullName(input.fullName);
    }

    if (input.profileImage !== undefined) {
      user.updateProfileImage(input.profileImage);
    }


    if (input.companyName !== undefined) {
      profile.updateCompanyName(input.companyName);
    }

    if (input.companyWebsite !== undefined) {
      profile.updateCompanyWebsite(input.companyWebsite);
    }

    if (input.companySize !== undefined) {
      profile.updateCompanySize(input.companySize);
    }

    if (input.designation !== undefined) {
      profile.updateDesignation(input.designation);
    }

    if (input.industry !== undefined) {
      profile.updateIndustry(input.industry);
    }

    if (input.location !== undefined) {
      profile.updateLocation(input.location);
    }

    if (input.bio !== undefined) {
      profile.updateBio(input.bio);
    }

    if (input.linkedinUrl !== undefined) {
      profile.updateLinkedinUrl(input.linkedinUrl);
    }


    await this.userRepo.save(user);
    await this.recruiterRepo.save(profile);


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
