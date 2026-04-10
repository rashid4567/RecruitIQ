import { Types } from "mongoose";
import { RecruiterProfile } from "../../domain/entities/recruiter-profile.entity";
import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { RecruiterProfileModel } from "../mongoose/model/recruiter-profile.model";
import { subscribtionStatus } from "../../domain/constatns/subscribtionStatus.contsants";
import { verificationStatus } from "../../domain/constatns/verificationStatus.constants";

export class MongooseRecruiterProfileRepository implements RecruiterProfileRepository{
  async findByUserId(userId: UserId){
    const doc = await RecruiterProfileModel.findOne({
      userId : new Types.ObjectId(userId.getValue())
    }).lean();

    if(!doc)return null;

   return RecruiterProfile.fromPersistence({
  userId,
  companyName: doc.companyName ?? "",
  companyWebsite: doc.companyWebsite ?? "",
  companySize: doc.companySize ?? 0,
  industry: doc.industry ?? "",
  designation: doc.designation ?? "",
  bio: doc.bio ?? "",
  linkedinUrl: doc.linkedinUrl ?? "",
  location: doc.location ?? "",
  subscriptionStatus: (doc.subscriptionStatus ?? "free") as subscribtionStatus,
  jobPostsUsed: doc.jobPostsUsed ?? 0,
  verificationStatus: (doc.verificationStatus ?? "pending") as verificationStatus,
});

  }


 async save(profile: RecruiterProfile): Promise<void> {
    const userObjectId = new Types.ObjectId(profile.getUserId().getValue());

    const updateData: any = {
      userId: userObjectId,
      companyName: profile.getCompanyName(),
      companyWebsite: profile.getCompanyWebsite(),
      designation: profile.getDesignation(),
      bio: profile.getBio(),
      linkedinUrl: profile.getLinkedinUrl(),
      location: profile.getLocation(),
      subscriptionStatus: profile.getSubscriptionStatus(),
      jobPostsUsed: profile.getJobPostsUsed(),
      verificationStatus: profile.getVerificationStatus(),
    };

    const companySize = profile.getCompanySize();
    if (companySize !== undefined) {
      updateData.companySize = companySize;
    }

    const industry = profile.getIndustry();
    if (industry !== undefined) {
      updateData.industry = industry;
    }

    await RecruiterProfileModel.findOneAndUpdate(
      { userId: userObjectId },
      updateData,
      { upsert: true, new: true }
    );
  }
}