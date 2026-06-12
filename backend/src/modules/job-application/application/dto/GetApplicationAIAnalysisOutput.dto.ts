export interface GetApplicationAIAnalysisOutput {
  applicationId: string;
  aiAnalysis: {
    overallScore: number;
    requiredSkillsScore: number;
    preferredSkillsScore: number;
    experienceScore: number;
    requirementsScore: number;
    educationScore: number;
    strengths: string[];
    gaps: string[];
    missingCriticalSkills: string[];
    recommendation: string;
    summary: string;
    analyzedAt: Date;
  } | null;
}