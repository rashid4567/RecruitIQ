import { Job } from "../../../job/domain/entities/job.entity";
import { Resume } from "../../../resume/domain/entity/resume.entity";

export interface ApplicationAnalysis {
  overallScore: number;
  requiredSkillsScore: number;
  preferredSkillsScore: number;
  experienceScore: number;
  requirementsScore: number;
  educationScore: number;
  strengths: string[];
  gaps: string[];
  missingCriticalSkills: string[];
  recommendation:
    | "STRONG_MATCH"
    | "GOOD_MATCH"
    | "PARTIAL_MATCH"
    | "POOR_MATCH";
  summary: string;
}

export interface ApplicationAnalysisService {
  analyze(
    job: Job,
    resume: Resume,
    coverLetter?: string,
  ): Promise<ApplicationAnalysis>;
}
