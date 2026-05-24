import { FilterQuery, Types } from "mongoose";
import {
  Job,
  JobStatus,
  JobType,
  JobVisibility,
} from "../../domain/entities/job.entity";
import { JobRepository } from "../../domain/repositories/job.repository";

import {
  JobFilters,
  PaginationOptions,
  PaginatedResult,
  SortOptions,
} from "../../domain/types/job-filter.type";
import { JobPostModel } from "../mongoose/job-post.model";

type JobLeanDocument = {
  _id: Types.ObjectId;
  recruiterId: Types.ObjectId;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  location: {
    city: string;
    state: string;
    country: string;
  };
  isRemote: boolean;
  jobType: JobType;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  department: string;
  positions: number;
  visibility: JobVisibility;
  isBlocked: boolean;
  status: JobStatus;
  postedOn?: Date;
  expiresAt?: Date;
  externalLink?: string;
  views: number;
  applicationsCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class MongooseJobRepository implements JobRepository {
  async create(job: Job): Promise<Job> {
    const doc = await JobPostModel.create(this.toPersistence(job));
    return this.toDomain(doc.toObject());
  }

  async save(job: Job): Promise<Job> {
    const doc = await JobPostModel.findByIdAndUpdate(
      job.id,
      this.toPersistence(job),
      {
        new: true,
      },
    ).lean<JobLeanDocument>();
    if (!doc) {
      throw new Error("Job not found");
    }
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Job | null> {
    const doc = await JobPostModel.findById(id).lean<JobLeanDocument>();
    if (!doc) {
      return null;
    }
    return this.toDomain(doc);
  }

  async findByRecruiter(recruiterId: string): Promise<Job[]> {
    const docs = await JobPostModel.find({
      recruiterId,
      isDeleted: false,
    })
      .sort({
        createdAt: -1,
      })
      .lean<JobLeanDocument[]>();
    return docs.map((x) => this.toDomain(x));
  }

  async incrementViews(jobId: string): Promise<void> {
    await JobPostModel.updateOne(
      {
        _id: jobId,
      },
      {
        $inc: {
          views: 1,
        },
      },
    );
  }

  async incrementApplications(jobId: string): Promise<void> {
    await JobPostModel.updateOne(
      {
        _id: jobId,
      },

      {
        $inc: {
          applicationsCount: 1,
        },
      },
    );
  }

  async findAll(
  filters: JobFilters,
  pagination: PaginationOptions,
  sort?: SortOptions,
): Promise<PaginatedResult<Job>> {

  const query: FilterQuery<JobLeanDocument> = {};

  /* deleted */

  if (!filters.includeDeleted) {
    query.isDeleted = false;
  }

  /* candidate side */

  if (filters.forCandidate) {

    query.isDeleted = false;

    query.isBlocked = false;

    query.visibility = "active";

    query.status = "active";

    query.$or = [
      {
        expiresAt: {
          $exists: false,
        },
      },

      {
        expiresAt: {
          $gt: new Date(),
        },
      },
    ];
  }

  /* search */

  if (filters.search) {

    query.$and = query.$and ?? [];

    query.$and.push({
      $or: [
        {
          title: {
            $regex: filters.search,
            $options: "i",
          },
        },

        {
          description: {
            $regex: filters.search,
            $options: "i",
          },
        },

        {
          requiredSkills: {
            $in: [filters.search],
          },
        },
      ],
    });

  }

  if (filters.recruiterId) {
    query.recruiterId =
      new Types.ObjectId(
        filters.recruiterId
      );
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.jobType) {
    query.jobType = filters.jobType;
  }

  if (
    filters.isBlocked !==
    undefined
  ) {
    query.isBlocked =
      filters.isBlocked;
  }

  if (filters.department) {
    query.department =
      filters.department;
  }

  if (
    filters.isRemote !==
    undefined
  ) {
    query.isRemote =
      filters.isRemote;
  }

  if (
    filters.requiredSkills
      ?.length
  ) {
    query.requiredSkills = {
      $in:
      filters.requiredSkills,
    };
  }

  if (
    filters.salaryMin !==
    undefined
  ) {
    query["salary.min"] = {
      $gte:
      filters.salaryMin,
    };
  }

  if (
    filters.salaryMax !==
    undefined
  ) {
    query["salary.max"] = {
      $lte:
      filters.salaryMax,
    };
  }

  const page =
    pagination.page;

  const limit =
    pagination.limit;

  const skip =
    (page - 1) * limit;

  const [docs, total] =
    await Promise.all([

      JobPostModel.find(
        query
      )

      .sort({
        [sort?.field ??
        "createdAt"]:
        sort?.order ===
        "asc"
          ? 1
          : -1,
      })

      .skip(skip)

      .limit(limit)

      .lean<JobLeanDocument[]>(),

      JobPostModel.countDocuments(
        query
      ),

    ]);

  return {
    data: docs.map(
      x =>
      this.toDomain(x)
    ),

    total,

    page,

    limit,

    totalPages:
      Math.ceil(
        total / limit
      ),
  };
}

  private toDomain(doc: JobLeanDocument): Job {
    return Job.rehydrate({
      id: doc._id.toString(),
      recruiterId: doc.recruiterId.toString(),
      title: doc.title,
      description: doc.description,
      responsibilities: doc.responsibilities,
      requirements: doc.requirements,
      requiredSkills: doc.requiredSkills,
      preferredSkills: doc.preferredSkills,
      experienceMin: doc.experienceMin,
      experienceMax: doc.experienceMax,
      location: doc.location,
      isRemote: doc.isRemote,
      jobType: doc.jobType,
      salary: doc.salary,
      department: doc.department,
      positions: doc.positions,
      visibility: doc.visibility,
      isBlocked: doc.isBlocked,
      status: doc.status,
      postedOn: doc.postedOn,
      expiresAt: doc.expiresAt,
      externalLink: doc.externalLink,
      views: doc.views,
      applicationsCount: doc.applicationsCount,
      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
  private toPersistence(job: Job) {
    return job.toObject();
  }
}
