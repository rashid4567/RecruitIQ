import { candidateProfileModel } from "../monogoose/models/candidate-profile.model";
import { CandidateProfile } from "../../domain/entities/candidate-profile.entity";
import { CandidateRespository } from "../../domain/repositories/candidate.repository";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { Types } from "mongoose";

export class MongooseCandidateRepository implements CandidateRespository {
  async findByUserId(userId: UserId) {
  const doc = await candidateProfileModel.findOne({
    userId: new Types.ObjectId(userId.getValue()),
  });

  if (!doc) return null;

  return CandidateProfile.fromPersistence({
    userId,
    currentJob: doc.currentJob ?? "",
    experienceYears: doc.experienceYears,
    skills: doc.skills ?? [],
    educationLevel: doc.educationLevel ?? "",
    preferredJobLocations: doc.preferredJobLocations ?? [],
    bio: doc.bio ?? "",
    currentJobLocation: doc.currentJobLocation ?? "",
    gender: doc.gender ?? "",
    linkedinUrl: doc.linkedinUrl ?? "",
    portfolioUrl: doc.portfolioUrl ?? "",
    profileComplete: doc.profileCompleted,
  });
}


 async save(profile: CandidateProfile) {
  const userObjectId = new Types.ObjectId(
    profile.getUserId().getValue()
  );

  await candidateProfileModel.findOneAndUpdate(
    { userId: userObjectId },
    {
      userId: userObjectId,
      currentJob: profile.getCurrentJob(),
      experienceYears: profile.getExperienceYears(),
      skills: profile.getSkills(),
      educationLevel: profile.getEducationLevel(),
      preferredJobLocations: profile.getPreferredLocations(),
      bio: profile.getBio(),
      currentJobLocation: profile.getCurrentJobLocation(),
      gender: profile.getGender(),
      linkedinUrl: profile.getLinkedinUrl(),
      portfolioUrl: profile.getPortfolioUrl(),
      profileCompleted: profile.isProfileCompleted(),
    },
    { upsert: true, new: true }
  );
}


}
