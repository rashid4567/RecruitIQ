import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { UserServicePort } from "../ports/user.service.port";

export class GetRecruiterProfileUserCase {
  constructor(
    private readonly recruiterRepo: RecruiterProfileRepository,
    private readonly userService: UserServicePort
  ) {}

  async execute(userId: string) {
    let profile = await this.recruiterRepo.findByUserId(userId);
    if (!profile) {
      profile = await this.recruiterRepo.createIfNotExists(userId);
    }

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt,

      companyName: profile.companyName,
      companyWebsite: profile.companyWebsite,
      companySize: profile.companySize,
      industry: profile.industry,
      designation: profile.designation,
      location: profile.location,
      bio: profile.bio,

      subscriptionStatus: profile.subscribtionStatus,
      verificationStatus: profile.verificationStatus,
      jobPostsUsed: profile.jobPostUser,
    };
  }
}
