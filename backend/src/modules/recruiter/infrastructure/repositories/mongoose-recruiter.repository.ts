import { Types } from "mongoose";
import { RecruiterProfile } from "../../domain/entities/recruiter-profile.entity";
import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { UserId } from "../../domain/value.object.ts/user-Id.vo";
import { RecruiterProfileModel } from "../mongoose/model/recruiter-profile.model";

export class MongooseRecruiterProfileRepository implements RecruiterProfileRepository{
  async findByUserId(userId: UserId){
    const doc = await RecruiterProfileModel.findOne({
      userId : new Types.ObjectId(userId.getValue())
    })

    if(!doc)return null;

    return RecruiterProfile.fromPresistence({
      userId,
      companyName : doc.companyName ?? "",
      companyWebsite : doc.companyWebsite ?? "",
      comopanySize : doc.companySize ?? 0,
      industry : doc.industry ?? "",
      designation : doc.designation ?? "",
      bio : doc.bio ?? "",
      location : doc.location ?? "",
      subscribtionStatus : doc.subscriptionStatus ?? "",
      jobPostUsed : doc.jobPostsUsed ?? 0,
      verificationStatus : doc.verificationStatus ?? ""
    })
  }


  async save(profile : RecruiterProfile){
    const usereObjectId = new Types.ObjectId(
      profile.getUserId().getValue()
    )

    await RecruiterProfileModel.findOneAndUpdate(
      {userId : usereObjectId},
      {
        userId : usereObjectId,
        companyName : profile.getCompanyName(),
        companyWebsite : profile.getCompanyWebsite(),
        companySize : profile.getCompanySize(),
        designation : profile.getDesignation(),
        industry : profile.getIndustry(),
        bio : profile.getBio(),
        location : profile.getLocation(),
        subscriptionStatus : profile.getSubscriptionStatus(),
        jobPostsUsed : profile.getJobPostsUsed(),
        verificationStatus : profile.getVerificationStatus()
      },
      {upsert : true, new : true}
    )
  }
}