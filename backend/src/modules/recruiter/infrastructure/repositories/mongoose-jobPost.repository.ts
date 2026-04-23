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
      location: jobPost.getLocation(),
      isRemote: jobPost.getIsRemote(),
      jobType: jobPost.getJobType(),
      salary: jobPost.getSalary(),
      department: jobPost.getDepartment(),
      positions: jobPost.getPositions(),
      visibility: jobPost.getVisibility(),       // ✅ added
      isBlocked: jobPost.getIsBlocked(),         // ✅ added
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
          location: jobPost.getLocation(),
          isRemote: jobPost.getIsRemote(),
          jobType: jobPost.getJobType(),
          salary: jobPost.getSalary(),
          department: jobPost.getDepartment(),
          positions: jobPost.getPositions(),
          visibility: jobPost.getVisibility(),   // ✅ added
          isBlocked: jobPost.getIsBlocked(),     // ✅ added
          status: jobPost.getStatus(),
          views: jobPost.getViews(),             // ✅ added
          applicationsCount: jobPost.getApplicationsCount(), // ✅ added
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

  async delete(id: string): Promise<void> {
    // ✅ soft delete instead of hard delete
    const result = await JobPostModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
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
      location: doc.location,
      isRemote: doc.isRemote,
      jobType: doc.jobType,
      salary: doc.salary,
      department: doc.department,
      positions: doc.positions,
      visibility: doc.visibility,               // ✅ added
      isBlocked: doc.isBlocked,                 // ✅ added
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