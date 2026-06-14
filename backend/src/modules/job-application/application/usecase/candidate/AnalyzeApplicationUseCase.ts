import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";

import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { ResumeRepository } from "../../../../resume/domain/repository/resume.repository";

import { JobApplication } from "../../../domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import {
  ApplicationAnalysis,
  ApplicationAnalysisService,
} from "../../../domain/services/ApplicationAnalysisService";

export class AnalyzeApplicationUseCase {
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
    private readonly jobRepository: JobRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly analysisService: ApplicationAnalysisService,
  ) {}

  async execute(applicationId: string): Promise<void> {
    const application = await this.getApplication(applicationId);
    const job = await this.getJob(application.jobId);
    const resume = await this.getResume(application.resumeId);
    const analysis = await this.analysisService.analyze(
      job,
      resume,
      application.coverLetter,
    );

    this.updateApplicationAnalysis(application, analysis);
    await this.applicationRepo.save(application);
  }

  private async getApplication(applicationId: string): Promise<JobApplication> {
    const application = await this.applicationRepo.findById(applicationId);
    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }
    return application;
  }

  private async getJob(jobId: string) {
    const job = await this.jobRepository.findById(jobId);
    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }
    return job;
  }

  private async getResume(resumeId: string) {
    const resume = await this.resumeRepository.findById(resumeId);

    if (!resume) {
      throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND);
    }
    return resume;
  }

  private updateApplicationAnalysis(
    application: JobApplication,
    analysis: ApplicationAnalysis,
  ): void {
    application.updateAIAnalysis({
      overallScore: analysis.overallScore,
      requiredSkillsScore: analysis.requiredSkillsScore,
      preferredSkillsScore: analysis.preferredSkillsScore,
      experienceScore: analysis.experienceScore,
      requirementsScore: analysis.requirementsScore,
      educationScore: analysis.educationScore,
      strengths: analysis.strengths,
      gaps: analysis.gaps,
      missingCriticalSkills: analysis.missingCriticalSkills,
      recommendation: analysis.recommendation,
      summary: analysis.summary,
      analyzedAt: new Date(),
    });
  }
}
