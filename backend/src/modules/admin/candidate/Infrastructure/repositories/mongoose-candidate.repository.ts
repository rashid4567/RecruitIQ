import { PipelineStage, Types } from "mongoose";
import { CandidateRepository } from "../../Domain/repositories/candidate.repository";
import { Candidate } from "../../Domain/entities/candidate.entity";
import { UserModel } from "../../../../auth/infrastructure/mongoose/model/user.model";
import { UserId } from "../../../../../shared/domain/value-objects.ts/userId.vo";
import { Email } from "../../../../../shared/domain/value-objects.ts/email.vo";
import { CandidateRow } from "../types/candidate.row.type";



export class MongooseCandidateRepository implements CandidateRepository {
  async getCandidates(input: {
    search?: string;
    status?: boolean;
    skip: number;
    limit: number;
  }): Promise<{ candidates: Candidate[]; total: number }> {
    const match: Record<string, unknown> = {
      role: "candidate",
    };

    if (input.status === true) {
      match.isActive = true;
    }

    if (input.status === false) {
      match.isActive = false;
    }

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

    const rows: CandidateRow[] = result[0].data;
    const total = result[0].total[0]?.count ?? 0;

    return {
      candidates: rows.map((row) =>
        Candidate.fromPersistence({
          id: UserId.create(row._id.toString()),
          name: row.fullName,
          email: Email.create(row.email),
          isActive: row.isActive,
        }),
      ),
      total,
    };
  }

  async findById(candidateId: string): Promise<Candidate | null> {
    
    if (!Types.ObjectId.isValid(candidateId)) return null;

    const doc = await UserModel.findOne({
      _id: candidateId,
      role: "candidate",
    }).lean();

    if (!doc) return null;

    return Candidate.fromPersistence({
      id: UserId.create(doc._id.toString()),
      name: doc.fullName ?? "",
      email: Email.create(doc.email),
      isActive: doc.isActive,
    });
  }
}
