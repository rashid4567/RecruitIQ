import { JobPost } from "../../domain/entities/job-post.entity";
import { JobPostRepository } from "../../domain/repositories/JobPostRepository";
import {
  JobPostDocument,
  JobPostModel,
} from "../mongoose/model/job-post.model";
import { DomainError } from "../../../../shared/errors/domain.error";
import { ERROR_CODES } from "../../domain/constatns/recruiter.profile.error";

export class MongooseJobPostRepository implements JobPostRepository {
  async create(jobPost: JobPost): Promise<JobPost> {
    const doc = await JobPostModel.create({
      recruiterId: jobPost.getRecruiterId(),
      title: jobPost.getTitle(),
      description: jobPost.getDescription(),
      responsibilities: jobPost.getResponsibilities(),
      requirements: jobPost.getRequirements(),
      requiredSkills: jobPost.getRequiredSkills(),
      preferredSkills: jobPost.getPreferredSkills(),
      experienceMin: jobPost.getExperienceMin(),
      experienceMax: jobPost.getExperienceMax(),
      location: {
        city: jobPost.getLocation().city,
        state: jobPost.getLocation().state,
        country: jobPost.getLocation().country,
      },
      isRemote: jobPost.getIsRemote(),
      jobType: jobPost.getJobType(),
      salary: {
        min: jobPost.getSalary().min,
        max: jobPost.getSalary().max,
        currency: jobPost.getSalary().currency,
      },
      department: jobPost.getDepartment(),
      positions: jobPost.getPositions(),
      visibility: jobPost.getVisibility(),
      isBlocked: jobPost.getIsBlocked(),
      status: jobPost.getStatus(),
      views: jobPost.getViews(),
      applicationsCount: jobPost.getApplicationsCount(),
      isDeleted: jobPost.getIsDeleted(),
      postedOn: jobPost.getPostedOn(),
      expiresAt: jobPost.getExpiresAt(),
      externalLink: jobPost.getExternalLink(),
    });

    return this.toEntity(doc);
  }

  async findById(id: string): Promise<JobPost | null> {
    const doc = await JobPostModel.findOne({ _id: id, isDeleted: false });
    return doc ? this.toEntity(doc) : null;
  }

  async findAllByRecruiter(recruiterId: string): Promise<JobPost[]> {
    const docs = await JobPostModel.find({
      recruiterId,
      isDeleted: false,
    }).sort({ createdAt: -1 });
    return docs.map((doc) => this.toEntity(doc));
  }

  async save(jobPost: JobPost): Promise<JobPost> {
    const doc = await JobPostModel.findOneAndUpdate(
      { _id: jobPost.getId(), isDeleted: false },
      {
        $set: {
          title: jobPost.getTitle(),
          description: jobPost.getDescription(),
          responsibilities: jobPost.getResponsibilities(),
          requirements: jobPost.getRequirements(),
          requiredSkills: jobPost.getRequiredSkills(),
          preferredSkills: jobPost.getPreferredSkills(),
          experienceMin: jobPost.getExperienceMin(),
          experienceMax: jobPost.getExperienceMax(),
          location: {
            city: jobPost.getLocation().city,
            state: jobPost.getLocation().state,
            country: jobPost.getLocation().country,
          },
          isRemote: jobPost.getIsRemote(),
          jobType: jobPost.getJobType(),
          salary: {
            min: jobPost.getSalary().min,
            max: jobPost.getSalary().max,
            currency: jobPost.getSalary().currency,
          },
          department: jobPost.getDepartment(),
          positions: jobPost.getPositions(),
          visibility: jobPost.getVisibility(),
          isBlocked: jobPost.getIsBlocked(),
          status: jobPost.getStatus(),
          views: jobPost.getViews(),
          applicationsCount: jobPost.getApplicationsCount(),
          isDeleted: jobPost.getIsDeleted(),
          postedOn: jobPost.getPostedOn(),
          expiresAt: jobPost.getExpiresAt(),
          externalLink: jobPost.getExternalLink(),
        },
      },
      { new: true },
    );

    if (!doc) {
      throw new DomainError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    return this.toEntity(doc);
  }

  async publish(id: string): Promise<JobPost> {
    const doc = await JobPostModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
        isBlocked: false,
        status: "draft",          
      },
      {
        $set: {
          status: "active",
          postedOn: new Date(),
        },
      },
      { new: true },
    );

    if (!doc) {

      const existing = await JobPostModel.findOne({ _id: id, isDeleted: false });

      if (!existing) {
        throw new DomainError(ERROR_CODES.JOB_POST_NOT_FOUND);
      }
      if (existing.isBlocked) {
        throw new DomainError(ERROR_CODES.CANNOT_UPDATE_BLOCKED);
      }
      if (existing.status === "expired") {
        throw new DomainError(ERROR_CODES.CANNOT_UPDATE_EXPIRED);
      }
      if (existing.status === "active") {
        throw new DomainError(ERROR_CODES.JOB_ALREADY_PUBLISHED);
      }

      throw new DomainError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    return this.toEntity(doc);
  }

  async delete(id: string): Promise<void> {
    const result = await JobPostModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, visibility: "hidden" } },
      { new: true },
    );

    if (!result) {
      throw new DomainError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }
  }

  private toEntity(doc: JobPostDocument): JobPost {
    return JobPost.fromPersistence({
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
      location: {
        city: doc.location.city,
        state: doc.location.state,
        country: doc.location.country,
      },
      isRemote: doc.isRemote,
      jobType: doc.jobType,
      salary: {
        min: doc.salary.min,
        max: doc.salary.max,
        currency: doc.salary.currency,
      },
      department: doc.department,
      positions: doc.positions,
      visibility: doc.visibility,
      isBlocked: doc.isBlocked,
      status: doc.status,
      views: doc.views,
      applicationsCount: doc.applicationsCount,
      isDeleted: doc.isDeleted,
      postedOn: doc.postedOn,
      expiresAt: doc.expiresAt,
      externalLink: doc.externalLink,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}