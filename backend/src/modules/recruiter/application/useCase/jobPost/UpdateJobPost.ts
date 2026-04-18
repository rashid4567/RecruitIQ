import { JobPost } from "../../../domain/entities/job-post.entity";
import { JobPostRepository } from "../../../domain/repositories/JobPostRepository";
import { UpdateJobPostDTO } from "../../dto/jobPost.dto";

export class UpdateJobPostUseCase {
  constructor(private readonly jobPostRepo: JobPostRepository) {}

  async execute(
    id: string,
    recruiterId: string,
    dto: UpdateJobPostDTO,
  ): Promise<JobPost> {
    const existing = await this.jobPostRepo.findById(id);

    if (!existing || existing.getRecruiterId() !== recruiterId) {
      throw new Error("Job post not found or unauthorized");
    }

    if (dto.title) {
      existing.updateTitle(dto.title);
    }

    if (dto.description) {
      existing.updateDescription(dto.description);
    }

    if (dto.experienceMin !== undefined || dto.experienceMax !== undefined) {
      existing.updateExperience(
        dto.experienceMin ?? existing.getExperienceMin(),
        dto.experienceMax ?? existing.getExperienceMax(),
      );
    }

    if (dto.salary) {
      existing.updateSalary(dto.salary);
    }

    if (dto.location) {
      existing.updateLocation(dto.location);
    }

    if (dto.responsibilities !== undefined) {
      existing.updateResponsibilities(dto.responsibilities);
    }

    if (dto.requirements !== undefined) {
      existing.updateRequirements(dto.requirements);
    }

    if (dto.requiredSkills !== undefined) {
      existing.updateRequiredSkills(dto.requiredSkills);
    }

    if (dto.preferredSkills !== undefined) {
      existing.updatePreferredSkills(dto.preferredSkills);
    }

    if (dto.isRemote !== undefined) {
      existing.updateIsRemote(dto.isRemote);
    }

    if (dto.jobType !== undefined) {
      existing.updateJobType(dto.jobType);
    }

    if (dto.department !== undefined) {
      existing.updateDepartment(dto.department);
    }

    if (dto.positions !== undefined) {
      existing.updatePositions(dto.positions);
    }

    if (dto.expiresAt !== undefined) {
      existing.updateExpiresAt(dto.expiresAt);
    }

    if (dto.externalLink !== undefined) {
      existing.updateExternalLink(dto.externalLink);
    }

    if (dto.status === "active" && existing.getStatus() !== "active") {
      existing.publish();
    }

    const updated = await this.jobPostRepo.save(existing);

    if (!updated) {
      throw new Error("Failed to update job post");
    }

    return updated;
  }
}
