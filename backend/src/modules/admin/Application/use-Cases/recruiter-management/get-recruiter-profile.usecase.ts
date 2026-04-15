import { ApplicationError } from "../../../../../shared/errors/application.error";
import { RecruiterRepository } from "../../../Domain/repositories/recruiter.repository";
import { ERROR_CODES } from "../../constants/errorcode.constants";
import { RecruiterProfileOutput } from "../../dto/recruiter.dto/recruiter-profile.output"; 

export class GetRecruiterProfileUseCase {
  constructor(private readonly recruiterRepo: RecruiterRepository) {}

  async execute(recruiterId: string): Promise<RecruiterProfileOutput> {
    const recruiter = await this.recruiterRepo.findById(recruiterId);

    if (!recruiter) {
      throw new ApplicationError(ERROR_CODES.RECRUITER_PROFILE_NOT_FOUND);
    }

    
    return {
    id: recruiter.id,
    name: recruiter.name,
    email: recruiter.email,
    isActive: recruiter.isActive,
    verificationStatus: recruiter.verificationStatus,
    subscriptionStatus: recruiter.subscriptionStatus ?? "free",
    jobPostsUsed: recruiter.jobPostsUsed ?? 0,
    joinedDate: recruiter.joinedDate ?? new Date(),
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