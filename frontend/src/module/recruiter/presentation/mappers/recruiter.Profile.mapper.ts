import { RecruiterProfile } from "../../Domain/entities/recruiterEntities";

export class RecruiterProfileMapper {
  static toDomain(dto: any): RecruiterProfile {
    const { user, recruiter } = dto;

    return new RecruiterProfile({
      fullName: user.fullName,
      email: user.email,

      companyName: recruiter.companyName,
      companyWebsite: recruiter.companyWebsite,
      companySize: recruiter.companySize,
      industry: recruiter.industry,
      location: recruiter.location,
      bio: recruiter.bio,
      designation: recruiter.designation,
      linkedinUrl: recruiter.linkedinUrl,

      subscriptionStatus: recruiter.subscriptionStatus,
      verificationStatus: recruiter.verificationStatus,
      jobPostsUsed: recruiter.jobPostsUsed,
    });
  }
}
