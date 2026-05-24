import { FilterQuery } from "mongoose";
import {
  CandidateJobPostRepository,
  FindAllJobPostOptions,
  PaginatedJobPosts,
} from "../../domain/repositories/candidatejobpost.repository";
import {
  JobPostDocument,
  JobPostModel,
} from "../../../job/infrastructure/mongoose/job-post.model";
import {
  JobPostEntity,
  JobPostProps,
} from "../../domain/entities/jobPost.entity";

export class MongooseCandidateJobPostRepository implements CandidateJobPostRepository {
  async findAll(options: FindAllJobPostOptions): Promise<PaginatedJobPosts> {
    const {
      page,
      limit,
      search,
      jobType,
      isRemote,
      skills,
      experienceMin,
      experienceMax,
      salaryMin,
      salaryMax,
      department,
    } = options;

    const filter: FilterQuery<JobPostDocument> = {
      status: "active",
      visibility: "active",
      isBlocked: false,
      isDeleted: false,
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: { $exists: false } },
      ],
    };

    if (search?.trim()) {
      filter.$text = { $search: search.trim() };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (typeof isRemote === "boolean") {
      filter.isRemote = isRemote;
    }

    if (skills?.length) {
      filter.requiredSkills = { $in: skills };
    }

    if (typeof experienceMin === "number") {
      filter.experienceMin = { $gte: experienceMin };
    }

    if (typeof experienceMax === "number") {
      filter.experienceMax = { $lte: experienceMax };
    }

    if (typeof salaryMin === "number") {
      filter["salary.min"] = { $gte: salaryMin };
    }

    if (typeof salaryMax === "number") {
      filter["salary.max"] = { $lte: salaryMax };
    }

    if (department) {
      filter.department = department;
    }

    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      JobPostModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      JobPostModel.countDocuments(filter),
    ]);

    return {
      data: docs.map(this.toEntity),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<JobPostEntity | null> {
    const doc = await JobPostModel.findOne({
      _id: id,
      isDeleted: false,
    }).lean();

    if (!doc) return null;

    return this.toEntity(doc);
  }

  async incrementViews(id: string): Promise<void> {
    await JobPostModel.updateOne({ _id: id }, { $inc: { views: 1 } });
  }

  private toEntity(doc: Record<string, any>): JobPostEntity {
    const props: JobPostProps = {
      id: doc._id.toString(),
      recruiterId: doc.recruiterId.toString(),

      title: doc.title,
      description: doc.description,

      responsibilities: doc.responsibilities ?? [],
      requirements: doc.requirements ?? [],

      requiredSkills: doc.requiredSkills ?? [],
      preferredSkills: doc.preferredSkills ?? [],

      experienceMin: doc.experienceMin,
      experienceMax: doc.experienceMax,

      location: {
        city: doc.location?.city ?? "",
        state: doc.location?.state ?? "",
        country: doc.location?.country ?? "",
      },

      isRemote: doc.isRemote,
      jobType: doc.jobType,

      salary: {
        min: doc.salary?.min ?? 0,
        max: doc.salary?.max ?? 0,
        currency: doc.salary?.currency ?? "INR",
      },

      department: doc.department ?? "",
      positions: doc.positions ?? 1,

      visibility: doc.visibility,
      isBlocked: doc.isBlocked,
      status: doc.status,

      postedOn: doc.postedOn ?? undefined,
      expiresAt: doc.expiresAt ?? undefined,
      externalLink: doc.externalLink ?? undefined,

      views: doc.views ?? 0,
      applicationsCount: doc.applicationsCount ?? 0,

      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    return JobPostEntity.create(props);
  }
}
