import { candidateProfileModel } from "../monogoose/models/candidate-profile.model";
import { CandidateProfile } from "../../domain/entities/candidate-profile.entity";
import { CandidateRespository } from "../../domain/repositories/candidate.repository";

export class MongooseCandidateRepository implements CandidateRespository {

  async findByUserId(userId: string) {
    const doc = await candidateProfileModel.findOne({ userId });
    if (!doc) return null;

    return new CandidateProfile(
      doc.userId.toString(),
      doc.currentJob ?? "",
      doc.experienceYears,
      doc.skills ?? [],
      doc.educationLevel ?? "",
      doc.preferredJobLocation ?? [],
      doc.bio ?? "",
      doc.profileCompleted
    );
  }

  async update(userId: string, data: any) {
    const doc = await candidateProfileModel.findOneAndUpdate(
      { userId },     
      data,
      { new: true, upsert: true }
    );

    return new CandidateProfile(
      doc.userId.toString(),
      doc.currentJob ?? "",
      doc.experienceYears,
      doc.skills ?? [],
      doc.educationLevel ?? "",
      doc.preferredJobLocation ?? [],
      doc.bio ?? "",
      doc.profileCompleted
    );
  }
}
