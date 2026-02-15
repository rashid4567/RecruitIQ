import { PipelineStage, Types } from "mongoose";
import { CandidateRepository } from "../../Domain/repositories/candidate.repository";
import { Candidate } from "../../Domain/entities/candidate.entity";
import { UserModel } from "../../../auth/infrastructure/mongoose/model/user.model";
import { UserId } from "../../../../shared/value-objects.ts/userId.vo";
import { Email } from "../../../../shared/value-objects.ts/email.vo";

export class MongooseCandidateRepository implements CandidateRepository {

  async getCandidates(input: {
    search?: string;
    status?: boolean;
    skip: number;
    limit: number;
  }): Promise<{ candidates: Candidate[]; total: number }> {

    const match: Record<string, any> = {
      role: "candidate",
    };


    if (input.status === true) match.isActive = true;
    if (input.status === false) match.isActive = false;

    if (input.search) {
      match.$or = [
        { fullName: { $regex: input.search, $options: "i" } },
        { email: { $regex: input.search, $options: "i" } },
      ];
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $facet: {
          data: [
            { $skip: input.skip },
            { $limit: input.limit },
            {
              $project: {
                _id: 1,
                fullName: 1,
                email: 1,
                isActive: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ];

    const result = await UserModel.aggregate(pipeline);
 
    const rows = result[0]?.data ?? [];
    const total = result[0]?.total[0]?.count ?? 0;

    return {
      candidates: rows.map((row: { _id: { toString: () => string; }; fullName: any; email: string; isActive: any; }) =>
        Candidate.fromList({
          id: UserId.create(row._id.toString()),
          name: row.fullName,
          email: Email.create(row.email),
          isActive: row.isActive,
        }),
      ),
      total,
    };
  }


  async findProfileById(candidateId: string): Promise<Candidate | null> {
    if (!Types.ObjectId.isValid(candidateId)) return null;

    const result = await UserModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(candidateId),
          role: "candidate",
        },
      },
      {
        $lookup: {
          from: "candidateprofiles",
          localField: "_id",
          foreignField: "userId",
          as: "profile",
        },
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (!result.length) return null;

    const doc = result[0];

    return Candidate.fromProfile({
      id: UserId.create(doc._id.toString()),
      name: doc.fullName,
      email: Email.create(doc.email),
      isActive: doc.isActive,
      currentJob: doc.profile?.currentJob,
      experienceYears: doc.profile?.experienceYears,
      educationLevel: doc.profile?.educationLevel,
      skills: doc.profile?.skills ?? [],
      preferredJobLocations: doc.profile?.preferredJobLocations ?? [],
      bio: doc.profile?.bio,
      currentJobLocation: doc.profile?.currentJobLocation,
      gender: doc.profile?.gender,
      linkedinUrl: doc.profile?.linkedinUrl,
      portfolioUrl: doc.profile?.portfolioUrl,
      profileCompleted: doc.profile?.profileCompleted ?? false,
    });
  }
}
