import { PipelineStage, Types } from "mongoose";
import { UserModel } from "../../../modules/auth/infrastructure/mongoose/model/user.model";

interface GetCandidatesArgs {
  search: string;
  status: "Active" | "Blocked" | "All";
  skip: number;
  limit: number;
}

export const getCandidatesFromDB = async ({
  search,
  status,
  skip,
  limit,
}: GetCandidatesArgs) => {
  const match: Record<string, any> = {
    role: "candidate",
  };

  if (status === "Active") {
    match.isActive = true;
  } else if (status === "Blocked") {
    match.isActive = false;
  }

  if (search && search.trim()) {
    match.$or = [
      { fullName: { $regex: search.trim(), $options: "i" } },
      { email: { $regex: search.trim(), $options: "i" } },
    ];
  }

  const pipeline: PipelineStage[] = [
    { $match: match },

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

    {
      $project: {
        id: "$_id",
        name: "$fullName",
        email: 1,

        skills: { $ifNull: ["$profile.skills", []] },
        experience: { $ifNull: ["$profile.experienceYears", 0] },
        location: { $ifNull: ["$profile.currentJobLocation", ""] },
        applications: { $ifNull: ["$profile.applicationsCount", 0] },

        status: {
          $cond: [{ $eq: ["$isActive", true] }, "Active", "Blocked"],
        },

        registeredDate: "$createdAt",
        profileCompleted: {
          $ifNull: ["$profile.profileCompleted", false],
        },
      },
    },

    { $sort: { registeredDate: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const [candidates, total] = await Promise.all([
    UserModel.aggregate(pipeline),
    UserModel.countDocuments(match),
  ]);

  return {
    candidates,
    total,
  };
};

export const updateCandidateStatus = async (
  candidateId: string,
  isActive: boolean
) => {
  return UserModel.findByIdAndUpdate(candidateId, { isActive });
};



export const getCandidateProfileFromDB = async (candidateId: string) => {
  console.log("ObjectId:", new Types.ObjectId(candidateId));
  const pipeline: PipelineStage[] = [
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

   {
  $project: {
    id: "$_id",
    name: "$fullName",
    email: 1,
    phone: "$phone",
    avatar: "$profileImage",

    verified: "$isVerified",
    status: {
      $cond: [{ $eq: ["$isActive", true] }, "Active", "Blocked"],
    },

    registeredDate: "$createdAt",
    lastActive: "Just now",

    jobTitle: "$profile.currentJob",
    location: "$profile.currentJobLocation",

    skills: { $ifNull: ["$profile.skills", []] },

    education: [
      {
        degree: "$profile.educationLevel",
        school: "",
        description: "",
      },
    ],

    experience: [
      {
        title: "$profile.currentJob",
        company: "",
        description: "",
      },
    ],

    statistics: {
      applications: { $literal: 0 },
      interviews: { $literal: 0 },
      completeness: {
        $cond: [{ $eq: ["$profile.profileCompleted", true] }, 100, 60],
      },
    },

    summary: "",
    riskFlags: [],

    aiAnalysis: {
      technical: 70,
      experience: 70,
      education: 70,
      overall: 70,
    },
  },
}

  ];

  const result = await UserModel.aggregate(pipeline);
  return result[0];
};
