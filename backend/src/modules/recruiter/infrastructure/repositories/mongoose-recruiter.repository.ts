import { Types } from "mongoose";
import { RecruiterProfile } from "../../domain/entities/recruiter-profile.entity";
import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { UserId } from "../../../../shared/value-objects/userId.vo";
import { RecruiterProfileModel } from "../mongoose/model/recruiter-profile.model";
import { subscriptionStatus } from "../../domain/constatns/subscriptionStatus.constants";
import { verificationStatus } from "../../domain/constatns/verificationStatus.constants";

export class MongooseRecruiterProfileRepository implements RecruiterProfileRepository {
  async findByUserId(userId: UserId): Promise<RecruiterProfile | null> {
    const doc = await RecruiterProfileModel.findOne({
      userId: new Types.ObjectId(userId.getValue()),
    }).lean();

    if (!doc) return null;

    return RecruiterProfile.reconstitute({
      userId,
      companyName: doc.companyName || undefined,
      companyWebsite: doc.companyWebsite || undefined,
      companySize: doc.companySize ?? undefined,
      industry: doc.industry || undefined,
      designation: doc.designation || undefined,
      bio: doc.bio || undefined,
      linkedinUrl: doc.linkedinUrl || undefined,
      location: doc.location || undefined,
      subscriptionStatus: (doc.subscriptionStatus ??
        "free") as subscriptionStatus,
      jobPostsUsed: doc.jobPostsUsed ?? 0,
      verificationStatus: (doc.verificationStatus ??
        "pending") as verificationStatus,
      profileCompleted: doc.profileCompleted ?? false,
    });
  }

  async save(profile: RecruiterProfile): Promise<void> {
    const userObjectId = new Types.ObjectId(profile.getUserId().getValue());

    await RecruiterProfileModel.findOneAndUpdate(
      { userId: userObjectId },
      {
        $set: {
          userId: userObjectId,
          companyName: profile.getCompanyName(),
          companyWebsite: profile.getCompanyWebsite(),
          companySize: profile.getCompanySize(),
          industry: profile.getIndustry(),
          designation: profile.getDesignation(),
          bio: profile.getBio(),
          linkedinUrl: profile.getLinkedinUrl(),
          location: profile.getLocation(),
          subscriptionStatus: profile.getSubscriptionStatus(),
          jobPostsUsed: profile.getJobPostsUsed(),
          verificationStatus: profile.getVerificationStatus(),
          profileCompleted: profile.isProfileCompleted(),
        },
      },
      { upsert: true, new: true },
    );
  }
}
