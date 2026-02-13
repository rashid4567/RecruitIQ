import { ApplicationError } from "../../../../shared/errors/applicatoin.error";
import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { UserId } from "../../../../shared/domain/value-objects.ts/userId.vo";
import { ERROR_CODES } from "../constants/error.code.constants";
import { CompleteRecruiterProfileDTO } from "../dto/complete-recruiter-profile.dto";

export class CompleteRecruiterProfileUseCase {
  constructor(private readonly recruiterRepo: RecruiterProfileRepository) {}

  async execute(
    userId: string,
    data: CompleteRecruiterProfileDTO,
  ): Promise<void> {
    const id = UserId.create(userId);

    const profile = await this.recruiterRepo.findByUserId(id);
    if (!profile) {
      throw new ApplicationError(ERROR_CODES.USER_NOT_FOUND);
    }
    if (data.companyWebsite !== undefined) {
      profile.updateCompanyWebsite(data.companyWebsite);
    }

    if (data.companySize !== undefined) {
      profile.updateCompanySize(data.companySize);
    }

    if (data.industry !== undefined) {
      profile.updateIndustry(data.industry);
    }

    if (data.designation !== undefined) {
      profile.updateDesignation(data.designation);
    }

    if (data.location !== undefined) {
      profile.updateLocation(data.location);
    }

    if (data.bio !== undefined) {
      profile.updateBio(data.bio);
    }

    await this.recruiterRepo.save(profile);
  }
}
