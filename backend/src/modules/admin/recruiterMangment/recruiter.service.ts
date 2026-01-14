// recruiter.service.ts
import { Types } from "mongoose";
import {
  aggregateRecruiters,
  updateRecruiterVerification,
  createRecruiterProfile,
  findRecruiterById,
  updateRecruiterActiveStatus,
  findRecruiterProfile,
} from "./recruiter.repo";
import { RecruiterListQuery, VerificationStatus } from "./recruiter.types";

export const getRecruiterList = async (query: RecruiterListQuery) => {

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const sort = query.sort;

  const match: any = { role: "recruiter" };

  if (query.isActive !== undefined) {
    match.isActive = query.isActive === "true";
  }

  if (query.search) {
    match.$or = [
      { fullName: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  const basePipeline: any[] = [
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

  if (query.verificationStatus) {
    basePipeline.push({
      $match: { "profile.verificationStatus": query.verificationStatus },
    });
  }

  if (query.subscriptionStatus) {
    basePipeline.push({
      $match: { "profile.subscriptionStatus": query.subscriptionStatus },
    });
  }

  basePipeline.push({
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

  // ✅ SORT FIX (latest / oldest)
  basePipeline.push({
    $sort: { createdAt: sort === "oldest" ? 1 : -1 },
  });

  // ✅ DATA PIPELINE
  const dataPipeline = [
    ...basePipeline,
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  // ✅ COUNT PIPELINE (NO MUTATION BUG)
  const countPipeline = [
    ...basePipeline,
    { $count: "total" },
  ];

  const recruiters = await aggregateRecruiters(dataPipeline);
  const countResult = await aggregateRecruiters(countPipeline);

  const total = countResult[0]?.total || 0;

  return {
    recruiters,
    pagination: {
      page,
      limit,
      total,
    },
  };
};

export const verifyRecruiter = async (
  userId: string,
  status: VerificationStatus
) => {
  let profile = await updateRecruiterVerification(userId, status);

  if (!profile) {
    const user = await findRecruiterById(userId);
    if (!user) throw new Error("Recruiter not found");

    profile = await createRecruiterProfile(
      userId,
      user.fullName || "Unknown",
      status
    );
  }

  return profile;
};

export const updateRecruiterStatus = async (
  userId: string,
  isActive: boolean
) => {
  return updateRecruiterActiveStatus(userId, isActive);
};

export const getRecruiterProfileService = async (recruiterId: string) => {
  if (!Types.ObjectId.isValid(recruiterId)) return null;

  const user = await findRecruiterById(recruiterId);
  if (!user) return null;

  const profile = await findRecruiterProfile(user._id);

  return {
  id: user._id,
  name: user.fullName,
  email: user.email,
  role: "Recruiter",
  isActive: user.isActive,
  profileImage: user.profileImage || "",

  verificationStatus: profile?.verificationStatus ?? "pending",
  company: profile?.companyName ?? "",
  bio: profile?.bio ?? "",
  location: profile?.location ?? "",
  timezone: "UTC",

  joinedDate: user.createdAt,
  lastActive: user.updatedAt,

  quickStats: {
    jobsPosted: profile?.jobPostsUsed ?? 0,
    interviewsScheduled: 0,
    candidatesContacted: 0,
  },

  subscription: {
    plan: profile?.subscriptionStatus ?? "free",
    status: profile?.subscriptionStatus ?? "free",
  },

  rating: 0,
  reviewCount: 0,
};

};
