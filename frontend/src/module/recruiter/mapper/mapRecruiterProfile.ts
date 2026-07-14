import type {
  RecruiterProfile,
  RecruiterProfileResponse,
} from "../types/recruiter.types";

export const mapRecruiterProfile = (
  response: RecruiterProfileResponse,
): RecruiterProfile => ({
  fullName: response.user.fullName ?? "",
  email: response.user.email ?? "",
  profileImage: response.user.profileImage,
  companyName: response.recruiter.companyName,
  companyWebsite: response.recruiter.companyWebsite,
  companySize: response.recruiter.companySize,
  industry: response.recruiter.industry,
  location: response.recruiter.location,
  bio: response.recruiter.bio,
  designation: response.recruiter.designation,
  linkedinUrl: response.recruiter.linkedinUrl,
  subscriptionStatus:
    response.recruiter.subscriptionStatus ?? "free",
  verificationStatus:
    response.recruiter.verificationStatus ?? "pending",
  jobPostsUsed:
    response.recruiter.jobPostsUsed ?? 0,
});