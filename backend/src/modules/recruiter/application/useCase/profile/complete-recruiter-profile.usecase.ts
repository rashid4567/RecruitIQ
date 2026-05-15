
import { RecruiterProfileRepository } from "../../../domain/repositories/recruiter.repository";
import { UserId } from "../../../../../shared/value-objects/userId.vo";
import { CompleteRecruiterProfileDTO } from "../../dto/complete-recruiter-profile.dto";
import { RecruiterProfile } from "../../../domain/entities/recruiter-profile.entity";

export class CompleteRecruiterProfileUseCase {
  constructor(
    private readonly recruiterRepo: RecruiterProfileRepository
  ) {}

  async execute(
    userId: string,
    data: CompleteRecruiterProfileDTO
  ): Promise<void> {

    const id = UserId.create(userId);

    let profile = await this.recruiterRepo.findByUserId(id);

    if (!profile) {
      profile = RecruiterProfile.createEmpty(id);
    }

    if (data.companyName !== undefined) {
      profile.updateCompanyName(data.companyName);
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

    if (data.linkedinUrl !== undefined) {
      profile.updateLinkedinUrl(data.linkedinUrl);
    }

    if (data.bio !== undefined) {
      profile.updateBio(data.bio);
    }

    await this.recruiterRepo.save(profile);
  }
}