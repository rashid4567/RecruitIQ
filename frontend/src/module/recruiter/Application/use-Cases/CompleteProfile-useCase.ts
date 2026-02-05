import type { RecruiterRepository } from "../../Domain/repositories/RecruiterRepository";
import type { SubscriptionStatus } from "../../Domain/constatns/subscribtionStatus";
import { RecruiterProfile } from "../../Domain/entities/recruiterEntities";

export class CompleteRecruiterProfileUseCase {
  private readonly repo: RecruiterRepository
  constructor( repo: RecruiterRepository) {
     this.repo = repo
  }

  async execute(input: {
    profile: RecruiterProfile;
    companyName: string;
    companyWebsite?: string;
    companySize?: number;
    industry?: string;
    designation?: string;
    location?: string;
    bio?: string;

    subscriptionStatus: SubscriptionStatus;
  }): Promise<void> {
    const completedProfile = input.profile.updateProfile({
      companyName: input.companyName,
      companyWebsite: input.companyWebsite,
      companySize: input.companySize,
      industry: input.industry,
      designation: input.designation,
      location: input.location,
      bio: input.bio,
    
    });

    await this.repo.completeProfile(
      new RecruiterProfile({
        ...completedProfile,
        subscriptionStatus: input.subscriptionStatus,
      })
    );
  }
}
