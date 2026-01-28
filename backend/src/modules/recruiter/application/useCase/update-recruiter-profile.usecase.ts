import { ApplicationError } from "../../../../shared/errors/applicatoin.error";
import { RecruiterProfile } from "../../domain/entities/recruiter-profile.entity";
import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { UserRepository } from "../../domain/repositories/user.entity";
import { UserId } from "../../domain/value.object.ts/user-Id.vo";
import { ERROR_CODES } from "../constants/error.code.constants";
import { RecruiterProfileReponse } from "../dto/recruiter-profile.dto";
import { UpdateRecruiterProfileDTO } from "../dto/update-recruiter-profile.dto";

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

    const profile = await this.recruiterRepo.findByUserId(id);
    if (!profile) {
      throw new ApplicationError(
        ERROR_CODES.RECRUITER_PROFILE_NOT_FOUND
      );
    }

    if (input.fullName !== undefined)
      user.updateFullName(input.fullName);

    if (input.profileImage !== undefined)
      user.updateProfileImage(input.profileImage);

    if (input.companyName !== undefined)
      profile.updateCompanyName(input.companyName);

    if (input.companyWebsite !== undefined)
      profile.updateCompanyWebsite(input.companyWebsite);

    if (input.companySize !== undefined)
      profile.updateCompanySize(input.companySize);

    if (input.designation !== undefined)
      profile.updateDesignation(input.designation);

    if (input.industry !== undefined)
      profile.updateIndustry(input.industry);

    if (input.bio !== undefined)
      profile.updateBio(input.bio);

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
        bio: profile.getBio(),
      },
    };
  }
}
