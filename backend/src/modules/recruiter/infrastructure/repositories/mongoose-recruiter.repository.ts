import { RecruiterProfileRepository } from "../../domain/repositories/recruiter.repository";
import { RecruiterProfile } from "../../domain/entities/recruiter-profile.entity";
import { RecruiterProfileModel } from "../../recruiterProfile.model";

export class MongooseRecruiterProfileRepository
  implements RecruiterProfileRepository
{
  async findByUserId(
    userId: string
  ): Promise<RecruiterProfile | null> {
    const doc = await RecruiterProfileModel.findOne({ userId }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async createIfNotExists(
    userId: string
  ): Promise<RecruiterProfile> {
    const doc = await RecruiterProfileModel.findOneAndUpdate(
      { userId },
      {},
      { upsert: true, new: true }
    ).lean();

    return this.toEntity(doc);
  }

  async updateByUserId(
    userId: string,
    data: Partial<RecruiterProfile>
  ): Promise<RecruiterProfile | null> {
    const doc = await RecruiterProfileModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true }
    ).lean();

    return doc ? this.toEntity(doc) : null;
  }

  private toEntity(doc: any): RecruiterProfile {
    return new RecruiterProfile(
      doc.userId.toString(),
      doc.companyName,
      doc.companyWebsite,
      doc.companySize,
      doc.industry,
      doc.designation,
      doc.location,
      doc.bio,
      doc.subscriptionStatus,
      doc.jobPostsUsed,
      doc.verificationStatus
    );
  }
}
