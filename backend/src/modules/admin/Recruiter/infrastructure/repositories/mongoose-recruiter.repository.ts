import { RecruiterRepository } from "../../Domain/repositories/recruiter.repository";
import { UserModel } from "../../../../auth/infrastructure/mongoose/model/user.model"; 
import { RecruiterProfileModel } from "../../../../recruiter/infrastructure/mongoose/model/recruiter-profile.model"; 
import { Types } from "mongoose";

export class MongooseRecruiterRepository
  implements RecruiterRepository {

  async getRecruiters(input: {
    search?: string;
    verificationStatus?: "pending" | "verified" | "rejected";
    subscriptionStatus?: string;
    isActive?: boolean;
    skip: number;
    limit: number;
    sort?: "latest" | "oldest";
  }): Promise<{ recruiters: any[]; total: number }> {

    const match: any = { role: "recruiter" };

    if (input.isActive !== undefined) {
      match.isActive = input.isActive;
    }

    if (input.search) {
      match.$or = [
        { fullName: { $regex: input.search, $options: "i" } },
        { email: { $regex: input.search, $options: "i" } },
      ];
    }

    const pipeline: any[] = [
      { $match: match },
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
      pipeline.push({
        $match: {
          "profile.verificationStatus": input.verificationStatus,
        },
      });
    }

    if (input.subscriptionStatus) {
      pipeline.push({
        $match: {
          "profile.subscriptionStatus": input.subscriptionStatus,
        },
      });
    }

    pipeline.push({
      $project: {
        fullName: 1,
        email: 1,
        isActive: 1,
        createdAt: 1,
        verificationStatus: "$profile.verificationStatus",
        subscriptionStatus: "$profile.subscriptionStatus",
        jobPostsUsed: "$profile.jobPostsUsed",
      },
    });

    pipeline.push({
      $sort: { createdAt: input.sort === "oldest" ? 1 : -1 },
    });

    const dataPipeline = [
      ...pipeline,
      { $skip: input.skip },
      { $limit: input.limit },
    ];

    const countPipeline = [...pipeline, { $count: "total" }];

    const recruiters = await UserModel.aggregate(dataPipeline);
    const countResult = await UserModel.aggregate(countPipeline);

    return {
      recruiters,
      total: countResult[0]?.total || 0,
    };
  }

  async verifyRecruiter(
    recruiterId: string,
    status: "pending" | "verified" | "rejected"
  ): Promise<any> {
    return RecruiterProfileModel.findOneAndUpdate(
      { userId: new Types.ObjectId(recruiterId) },
      { verificationStatus: status },
      { new: true, upsert: true }
    );
  }

  async updateActiveStatus(
    recruiterId: string,
    isActive: boolean
  ): Promise<void> {
    await UserModel.findByIdAndUpdate(
      recruiterId,
      { isActive }
    );
  }

  async getRecruiterProfile(
    recruiterId: string
  ): Promise<any | null> {
    if (!Types.ObjectId.isValid(recruiterId)) return null;

    const user = await UserModel.findOne({
      _id: recruiterId,
      role: "recruiter",
    });

    if (!user) return null;

    const profile = await RecruiterProfileModel.findOne({
      userId: user._id,
    });

    return {
      id: user._id,
      name: user.fullName,
      email: user.email,
      isActive: user.isActive,
      verificationStatus: profile?.verificationStatus ?? "pending",
      company: profile?.companyName ?? "",
      subscriptionStatus: profile?.subscriptionStatus ?? "free",
      jobPostsUsed: profile?.jobPostsUsed ?? 0,
      joinedDate: user.createdAt,
    };
  }
}
