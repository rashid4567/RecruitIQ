
import { candidateProfileModel } from "../mongoose/models/candidate-profile.model";
import { CandidateProfile } from "../../domain/entities/candidate-profile.entity";
import { CandidateRepository } from "../../domain/repositories/candidate.repository";
import { UserId } from "../../../../shared/value-objects/userId.vo";

export class MongooseCandidateRepository implements CandidateRepository {
  async findByUserId(userId: UserId): Promise<CandidateProfile | null> {
    const doc = await candidateProfileModel
      .findOne({ userId: userId.getValue() })
      .lean();

    if (!doc) return null;


    return CandidateProfile.fromPersistence({
      userId,
      currentJob: doc.currentJob ?? "",
      experienceYears: doc.experienceYears,
      skills: doc.skills ?? [],
      educationLevel: doc.educationLevel ?? "",
      preferredJobLocations: doc.preferredJobLocations ?? [],
      bio: doc.bio ?? "",
      currentJobLocation : doc.currentJobLocation ?? "",
      gender: doc.gender ?? undefined,
      linkedinUrl: doc.linkedinUrl ?? "",
      portfolioUrl: doc.portfolioUrl ?? "",
      profileCompleted: doc.profileCompleted ?? false,
    });
  }

  async save(profile: CandidateProfile): Promise<void> {
    const userId = profile.getUserId().getValue();

    const updated = await candidateProfileModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
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
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      throw new Error("Failed to save candidate profile");
    }
  }
}