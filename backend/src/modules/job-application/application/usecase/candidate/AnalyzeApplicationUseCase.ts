import { ERROR_CODES } from "../../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { JobRepository } from "../../../../job/domain/repositories/job.repository";
import { ResumeRepository } from "../../../../resume/domain/repository/resume.repository";
import { ApplicationRecommendation } from "../../../domain/entity/job-application.entity";
import { JobApplicationRepository } from "../../../domain/repository/job-application.repository";
import { ApplicationAnalysisService } from "../../../domain/services/ApplicationAnalysisService";

export class AnalyzeApplicationUseCase {
  constructor(
    private readonly applicationRepo: JobApplicationRepository,
    private readonly jobRepository: JobRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly analysisService: ApplicationAnalysisService,
  ) {}

  async execute(applicationId: string): Promise<void> {
    const application = await this.applicationRepo.findById(applicationId);

    if (!application) {
      throw new ApplicationError(ERROR_CODES.APPLICATION_NOT_FOUND);
    }

    const job = await this.jobRepository.findById(application?.jobId);
    if (!job) {
      throw new ApplicationError(ERROR_CODES.JOB_POST_NOT_FOUND);
    }

    const resume = await this.resumeRepository.findById(application.resumeId);

    if (!resume) {
      throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND);
    }

    const analysis = await this.analysisService.analyze(
      job,
      resume,
      application.coverLetter,
    );

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
      recommendation: analysis.recommendation as ApplicationRecommendation,
      summary: analysis.summary,
      analyzedAt: new Date(),
    });

    await this.applicationRepo.save(application);
  }
}
