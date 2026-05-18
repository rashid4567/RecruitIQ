import { PipelineStage, Types } from "mongoose";
import { JobPost } from "../../Domain/entities/jobPost-entity";
import {
  AdminJobPostFilters,
  JobPostRepostory,
  PaginatedResult,
  PaginationOptions,
  SortField,
} from "../../Domain/repositories/jobPost-repository";

import {
  JobPostDocument,
  JobPostModel,
} from "../../../recruiter/infrastructure/mongoose/model/job-post.model";

import { UserId } from "../../../../shared/value-objects/userId.vo";

type JobPostAggregateResult = {
  data: JobPostDocument[];
  total: { count: number }[];
};

export class MongooseJobPostRepository implements JobPostRepostory {
  async findAll(
    filters: AdminJobPostFilters,
    pagination: PaginationOptions,
    sort: SortField,
    includeDeleted: boolean = false,
  ): Promise<PaginatedResult<JobPost>> {
    const match: Record<string, unknown> = {};

    if (!includeDeleted) {
      match.isDeleted = false;
    }

    if (filters.search?.trim()) {
      const search = filters.search.trim();

      match.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          requiredSkills: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    if (filters.status) {
      match.status = filters.status;
    }
    if (filters.isBlocked !== undefined) {
      match.isBlocked = filters.isBlocked;
    }
    if (filters.jobType) {
      match.jobType = filters.jobType;
    }

    if (filters.recruiterId) {
      match.recruiterId = new Types.ObjectId(filters.recruiterId);
    }

    if (filters.location?.trim()) {
      const regex = {
        $regex: filters.location.trim(),
        $options: "i",
      };

      match.$or = [
        { "location.city": regex },
        { "location.state": regex },
        { "location.country": regex },
      ];
    }

    if (filters.postedAfter || filters.postedBefore) {
      match.postedOn = {};
      if (filters.postedAfter) {
        (match.postedOn as Record<string, Date>).$gte = filters.postedAfter;
      }
      if (filters.postedBefore) {
        (match.postedOn as Record<string, Date>).$lte = filters.postedBefore;
      }
    }

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      {
        $match: match,
      },

      {
        $facet: {
          data: [
            {
              $sort: {
                [sort]: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],

          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const result =
      await JobPostModel.aggregate<JobPostAggregateResult>(pipeline);
    const rows: JobPostDocument[] = result[0]?.data ?? [];
    const total = result[0]?.total[0]?.count ?? 0;

    return {
      data: rows.map((row) => this.toDomain(row)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<JobPost | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const result = await JobPostModel.aggregate<JobPostDocument>([
      {
        $match: {
          _id: new Types.ObjectId(id),
          isDeleted: false,
        },
      },
    ]);

    if (!result.length) {
      return null;
    }
    return this.toDomain(result[0]);
  }

  async updateStatus(id: string, isBlocked: boolean): Promise<JobPost> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid JobPost id: ${id}`);
    }

    const doc = await JobPostModel.findByIdAndUpdate(
      id,
      {
        isBlocked,
      },
      {
        new: true,
      },
    ).lean<JobPostDocument>();

    if (!doc) {
      throw new Error(`JobPost not found: ${id}`);
    }
    return this.toDomain(doc);
  }
  private toDomain(row: JobPostDocument): JobPost {
    return JobPost.create({
      id: row._id.toString(),
      recruiterId: UserId.create(row.recruiterId.toString()),
      title: row.title,
      description: row.description,
      responsibilities: row.responsibilities,
      requirements: row.requirements,
      requiredSkills: row.requiredSkills,
      preferredSkills: row.preferredSkills,
      experienceMin: row.experienceMin,
      experienceMax: row.experienceMax,
      location: row.location,
      isRemote: row.isRemote,
      jobType: row.jobType,
      salary: row.salary,
      department: row.department,
      positions: row.positions,
      visibility: row.visibility,
      isBlocked: row.isBlocked,
      status: row.status,
      postedOn: row.postedOn,
      expiresAt: row.expiresAt,
      externalLink: row.externalLink,
      views: row.views,
      applicationsCount: row.applicationsCount,
      isDeleted: row.isDeleted,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}