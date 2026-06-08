import { Types, PipelineStage } from "mongoose";
import { RecruiterRepository } from "../../Domain/repositories/recruiter.repository";
import {
  Recruiter,
  VerificationStatus,
  SubscriptionStatus,
} from "../../Domain/entities/recruiter.entity";

import { UserModel } from "../../../auth/infrastructure/mongoose/model/user.model";
import { RecruiterProfileModel } from "../../../recruiter/infrastructure/mongoose/model/recruiter-profile.model";
import { RecruiterAggregate } from "../types/recruiter-aggregate.type";
import { GetRecruitersInput } from "../../Application/dto/recruiter.dto/get-recruiters.input";

export class MongooseRecruiterRepository implements RecruiterRepository {
  async getRecruiters(
    input: GetRecruitersInput,
  ): Promise<{ recruiters: Recruiter[]; total: number }> {
    const match: Record<string, unknown> = {
      role: "recruiter",
    };

    if (input.isActive !== undefined) {
      match.isActive = input.isActive;
    }

    if (input.search) {
      match.$or = [
        {
          fullName: {
            $regex: input.search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: input.search,
            $options: "i",
          },
        },
      ];
    }

    const basePipeline: PipelineStage[] = [
      {
        $match: match,
      },
      {
        $lookup: {
          from: "recruiterprofiles",
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
    ];

    if (input.verificationStatus) {
      basePipeline.push({
        $match: {
          "profile.verificationStatus": input.verificationStatus,
        },
      });
    }

    if (input.subscriptionStatus) {
      basePipeline.push({
        $match: {
          "profile.subscriptionStatus": input.subscriptionStatus,
        },
      });
    }

    basePipeline.push(
      {
        $project: {
          fullName: 1,
          email: 1,
          isActive: 1,
          createdAt: 1,
          profileImage: 1,
          verificationStatus: {
            $ifNull: ["$profile.verificationStatus", "pending"],
          },
        },
      },
      {
        $sort: {
          createdAt: input.sort === "oldest" ? 1 : -1,
        },
      },
    );

    const dataPipeline: PipelineStage[] = [
      ...basePipeline,
      {
        $skip: input.skip,
      },
      {
        $limit: input.limit,
      },
    ];

    const countPipeline: PipelineStage[] = [
      ...basePipeline,
      {
        $count: "total",
      },
    ];

    const [data, count] = await Promise.all([
      UserModel.aggregate<RecruiterAggregate>(dataPipeline),
      UserModel.aggregate<{ total: number }>(countPipeline),
    ]);

    const recruiters = data.map((doc) =>
      Recruiter.fromPersistence({
        id: doc._id.toString(),
        name: doc.fullName,
        email: doc.email,
        isActive: doc.isActive,
        profileImage: doc.profileImage,
        verificationStatus: doc.verificationStatus,
      }),
    );

    return {
      recruiters,
      total: count[0]?.total ?? 0,
    };
  }

  async findById(recruiterId: string): Promise<Recruiter | null> {
    if (!Types.ObjectId.isValid(recruiterId)) {
      return null;
    }
    const user = await UserModel.findOne({
      _id: recruiterId,
      role: "recruiter",
    }).lean();

    if (!user) {
      return null;
    }
    const profile = await RecruiterProfileModel.findOne({
      userId: user._id,
    }).lean();
    return Recruiter.fromPersistence({
      id: user._id.toString(),
      name: user.fullName ?? "",
      email: user.email,
      isActive: user.isActive,
      profileImage: user.profileImage ?? "",
      joinedDate: user.createdAt,
      verificationStatus: (profile?.verificationStatus ??
        "pending") as VerificationStatus,
      subscriptionStatus: (profile?.subscriptionStatus ??
        "free") as SubscriptionStatus,
      jobPostsUsed: profile?.jobPostsUsed ?? 0,
      companyName: profile?.companyName ?? "",
      companyWebsite: profile?.companyWebsite ?? "",
      companySize: profile?.companySize ?? 0,
      industry: profile?.industry ?? "",
      designation: profile?.designation ?? "",
      location: profile?.location ?? "",
      linkedinUrl: profile?.linkedinUrl ?? "",
      bio: profile?.bio ?? "",
    });
  }

  async verifyRecruiter(
    recruiterId: string,
    status: VerificationStatus,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(recruiterId)) {
      throw new Error("Invalid recruiter id");
    }

    await RecruiterProfileModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(recruiterId),
      },
      {
        verificationStatus: status,
      },
      {
        upsert: true,
      },
    );
  }
}
