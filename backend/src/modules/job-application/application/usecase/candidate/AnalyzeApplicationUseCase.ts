import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { UseCase } from "../../../../../shared/interfaces/usecase.interface";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { ResumeParseStatus } from "../../../../resume/domain/entity/resume.entity";
import { ResumeRepository } from "../../../../resume/domain/repository/resume.repository";
import { RecruiterSubscriptionRepository } from "../../../../subscription/domain/repository/recruiter-subscription-plan-repository";
import { JobApplication } from "../../../domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import {
  ApplicationAnalysis,
  ApplicationAnalysisService,
} from "../../../domain/services/ApplicationAnalysisService";
import { AnalyzeApplicationRequestDTO } from "../../dto/analyseJobpost.dto";

export class AnalyzeApplicationUseCase implements UseCase<
  AnalyzeApplicationRequestDTO,
  void
> {
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
    private readonly jobRepository: JobRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly analysisService: ApplicationAnalysisService,
    private readonly subscriptionRepo: RecruiterSubscriptionRepository,
  ) {}

  async execute(request: AnalyzeApplicationRequestDTO): Promise<void> {
    const application = await this.getApplication(request.applicationId);

    if (
      application.isAnalysisCompleted() ||
      application.isAnalysisProcessing()
    ) {
      return;
    }

    const resume = await this.getResume(application.resumeId);
    if (resume.getParseStatus() !== ResumeParseStatus.COMPLETED) {
      return;
    }

    const subscription = await this.subscriptionRepo.findActiveByRecruiter(
      application.recruiterId,
    );

    if (!subscription) {
      application.markAnalysisQuotaExceeded();
      await this.applicationRepo.save(application);
      return;
    }

    if (!subscription.hasAIScoreAccess()) {
      application.markAnalysisQuotaExceeded();
      await this.applicationRepo.save(application);
      return;
    }

    try {
      const updatedSubscription = subscription.consumeAIScore();
      await this.subscriptionRepo.update(updatedSubscription);
      application.markAnalysisProcessing();
      await this.applicationRepo.save(application);
      const job = await this.getJob(application.jobId);
      const analysis = await this.analysisService.analyze(
        job,
        resume,
        application.coverLetter,
      );

      this.updateApplicationAnalysis(application, analysis);
      await this.applicationRepo.save(application);
    } catch (error) {
      try {
        application.markAnalysisFailed();
        await this.applicationRepo.save(application);
      } catch (saveError) {
        console.error("Failed to update analysis status", saveError);
      }
      throw error;
    }
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
