import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { ResumeRepository } from "../../../../resume/domain/repository/resume.repository";
import { JobApplication } from "../../../domain/entity/job-application.entity";
import { APPLICATION_ERRORS } from "../../../domain/error/Application.error";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";

import { ApplyJobDTO } from "../../dto/applyJobDto";

export class ApplyJobUseCase {
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
    private readonly jobRepo: JobRepository,
    private readonly resumeRepo: ResumeRepository,
  ) {}

  async execute(dto: ApplyJobDTO): Promise<JobApplication> {
    const { jobId, candidateId, resumeId, coverLetter } = dto;

    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new ApplicationError(APPLICATION_ERRORS.JOB_NOT_FOUND);
    }
    if (!job.canApply()) {
      throw new ApplicationError(APPLICATION_ERRORS.JOB_NOT_ACTIVE);
    }
    if (job.isExpired()) {
      throw new ApplicationError(APPLICATION_ERRORS.JOB_EXPIRED);
    }

    const resume = await this.resumeRepo.findById(resumeId);
    if (!resume) {
      throw new ApplicationError(APPLICATION_ERRORS.RESUME_NOT_FOUND);
    }
    if (resume.getCandidateId() !== candidateId) {
      throw new ApplicationError(
        APPLICATION_ERRORS.UNAUTHORIZED_CANDIDATE_ACTION,
      );
    }

    const existing = await this.applicationRepo.findExistingApplication(
      candidateId,
      jobId,
    );
    if (existing) {
      throw new ApplicationError(APPLICATION_ERRORS.APPLICATION_ALREADY_EXISTS);
    }

    const application = JobApplication.apply({
      jobId,
      candidateId,
      recruiterId: job.recruiterId,
      resumeId,
      coverLetter,
    });

    const created = await this.applicationRepo.create(application);
    job.incrementApplications();
    await this.jobRepo.save(job);
    return created;
  }
}
