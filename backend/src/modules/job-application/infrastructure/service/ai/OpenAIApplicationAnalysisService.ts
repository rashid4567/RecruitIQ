import OpenAI from "openai";
import { z } from "zod";

import {
  ApplicationAnalysis,
  ApplicationAnalysisService,
} from "../../../domain/services/ApplicationAnalysisService";

import { Job } from "../../../../job/domain/entities/job.entity";
import { Resume } from "../../../../resume/domain/entity/resume.entity";
import { HTTP_STATUS } from "../../../../../shared/constants/httpStatus";
import { ApplicationError } from "../../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../../shared/constants/errorcode.constants";
import { ApplicationRecommendation } from "../../../domain/entity/job-application.entity";

const AnalysisSchema = z.object({
  requiredSkillsScore: z.number().min(0).max(100),
  preferredSkillsScore: z.number().min(0).max(100),
  experienceScore: z.number().min(0).max(100),
  requirementsScore: z.number().min(0).max(100),
  educationScore: z.number().min(0).max(100),
  strengths: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  missingCriticalSkills: z.array(z.string()).default([]),
  summary: z.string(),
});

type AnalysisResponse = z.infer<typeof AnalysisSchema>;

const MODEL = "gpt-5-mini";
const MAX_RETRIES = 3;
const PENALTY_PER_MISSING_SKILL = 3;
const MAX_PENALTY = 15;

const WEIGHTS = {
  requiredSkills: 0.35,
  experience: 0.25,
  requirements: 0.2,
  preferredSkills: 0.1,
  education: 0.1,
} as const;

const SYSTEM_PROMPT = `
You are an ATS candidate evaluation engine.

Rules:
- Return JSON only.
- No markdown.
- No explanations.
- No extra text.
- Scores must be integers between 0 and 100.
`.trim();

export class OpenAIApplicationAnalysisService implements ApplicationAnalysisService {
  constructor(private readonly openai: OpenAI) {}

  async analyze(
    job: Job,
    resume: Resume,
    coverLetter?: string,
  ): Promise<ApplicationAnalysis> {
    const parsedData = resume.getParsedData();

    if (!parsedData) {
      throw new ApplicationError(ERROR_CODES.RESUME_PARSE_NOT_FOUND);
    }

    const prompt = this.buildPrompt(job, parsedData, coverLetter);
    const raw = await this.fetchAnalysisWithRetry(
      prompt,
      parsedData.fullName,
      job.title,
    );
    return this.computeResult(raw);
  }

  private buildPrompt(
    job: Job,
    parsedData: NonNullable<ReturnType<Resume["getParsedData"]>>,
    coverLetter?: string,
  ): string {
    const jobData = job.toObject();

    const experienceText =
      parsedData.experience.length > 0
        ? parsedData.experience.join("\n\n")
        : "Not provided";

    const educationText =
      parsedData.education.length > 0
        ? parsedData.education.join("\n\n")
        : "Not provided";

    return `
You are both:

1. A Senior Technical Recruiter
2. An Applicant Tracking System (ATS)

Your task is to evaluate the candidate objectively against the job requirements.

JOB INFORMATION

Company:${job.companyName}
Job Title:${job.title}
Job Description:${job.description ?? "Not provided"}
Responsibilities:${this.formatArray(jobData.responsibilities)}
Requirements:${this.formatArray(jobData.requirements)}
Required Skills:${this.formatArray(jobData.requiredSkills)}
Preferred Skills:${this.formatArray(jobData.preferredSkills)}
Experience Required:${jobData.experienceMin ?? 0} - ${jobData.experienceMax ?? 0} years
Department:${job.department ?? "Not provided"}
Job Type:${jobData.jobType ?? "Not provided"}
Remote:${jobData.isRemote ? "Yes" : "No"}

CANDIDATE INFORMATION
Full Name:${parsedData.fullName ?? "Not provided"}
Email:${parsedData.email ?? "Not provided"}
Current Company:${parsedData.currentCompany ?? "Not provided"}
Current Role:${parsedData.currentRole ?? "Not provided"}
Total Experience:${parsedData.totalExperienceYears ?? 0} years
Skills:${parsedData.skills?.join(", ") || "Not provided"}
Experience:${experienceText}
Education:${educationText}
LinkedIn:${parsedData.linkedin ?? "Not provided"}
GitHub:${parsedData.github ?? "Not provided"}
Portfolio:${parsedData.portfolio ?? "Not provided"}
Cover Letter:${coverLetter ?? "Not provided"}

ANALYSIS PROCESS
Before assigning scores:
1. Compare required skills with candidate skills.
2. Compare preferred skills with candidate skills.
3. Compare candidate experience against required experience.
4. Compare job requirements against resume evidence.
5. Evaluate education relevance.
6. Identify missing required skills.
7. Then assign scores.

Do not assume skills or experience that are not explicitly mentioned.

TECHNOLOGY MATCHING RULES
Treat related technologies as partial matches only.

Examples:
* NestJS → Node.js
* Express.js → Node.js
* Next.js → React
* React Native → React
* PostgreSQL → SQL
* MySQL → SQL
* MongoDB → NoSQL Databases
* AWS Lambda → AWS
* TypeScript → JavaScript

Partial matches should receive 50%–80% credit.
Do not treat related technologies as full matches.

SCORING RULES
Required skills are the most important factor.

Rules:
* Missing required skills must significantly reduce scores.
* Preferred skills must not outweigh required skills.
* If more than 50% of required skills are missing, requiredSkillsScore should not exceed 50.
* If all required skills are present, requiredSkillsScore should generally be above 80.
* Relevant experience is more important than total years of experience.
* Candidates should not receive scores above 85 unless they satisfy most required skills and experience requirements.
* Be realistic and conservative.
* Do not inflate scores.

Score each category from 0–100.

100 = Perfect Match
90-99 = Exceptional Match
80-89 = Strong Match
70-79 = Good Match
60-69 = Acceptable Match
50-59 = Weak Match
0-49 = Poor Match

Evaluate:
1. Required Skills Match
2. Preferred Skills Match
3. Experience Alignment
4. Requirements Fulfillment
5. Education Relevance

OUTPUT RULES
strengths:

* Maximum 5 items
* Short and specific

gaps:
* Maximum 5 items
* Focus on weaknesses and missing qualifications

missingCriticalSkills:
* Include only missing REQUIRED skills
* Do not include preferred skills

summary:
* Maximum 75 words
* Explain overall suitability
* Mention key strengths
* Mention major gaps
* Be concise and recruiter-friendly

 RETURN ONLY VALID JSON
{
"requiredSkillsScore": 0,
"preferredSkillsScore": 0,
"experienceScore": 0,
"requirementsScore": 0,
"educationScore": 0,
"strengths": [],
"gaps": [],
"missingCriticalSkills": [],
"summary": ""
}
`.trim();
  }

  private async fetchAnalysisWithRetry(
    prompt: string,
    _candidateName: string | null | undefined,
    _jobTitle: string,
  ): Promise<AnalysisResponse> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: MODEL,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
          throw new ApplicationError(ERROR_CODES.AI_RESPONSE_IS_EMPTY);
        }
        return AnalysisSchema.parse(JSON.parse(content));
      } catch (error: unknown) {
        const { status, code } = this.extractErrorMeta(error);
        if (code === "insufficient_quota") {
          throw new ApplicationError(ERROR_CODES.AI_QUOTA_EXCEEDED);
        }
        if (
          status === HTTP_STATUS.UNAUTHORIZED ||
          status === HTTP_STATUS.FORBIDDEN
        ) {
          throw new ApplicationError(ERROR_CODES.AI_CONFIGURATION_ERROR);
        }

        const isRetriable =
          status === HTTP_STATUS.TOO_MANY_REQUESTS ||
          status === HTTP_STATUS.INTERNAL_SERVER_ERROR ||
          status === HTTP_STATUS.BAD_GATEWAY ||
          status === HTTP_STATUS.SERVICE_UNAVAILABLE ||
          status === HTTP_STATUS.GATEWAY_TIMEOUT ||
          (error instanceof Error &&
            error.message.includes("Invalid AI analysis response"));
        if (!isRetriable || attempt === MAX_RETRIES) {
          break;
        }
        const delay = Math.pow(2, attempt) * 1000;
        await this.sleep(delay);
      }
    }
    throw new ApplicationError(ERROR_CODES.APPLICATION_ANALYSIS_FAILED);
  }

  private computeResult(analysis: AnalysisResponse): ApplicationAnalysis {
    const requiredSkillsScore = this.normalizeScore(
      analysis.requiredSkillsScore,
    );
    const preferredSkillsScore = this.normalizeScore(
      analysis.preferredSkillsScore,
    );
    const experienceScore = this.normalizeScore(analysis.experienceScore);
    const requirementsScore = this.normalizeScore(analysis.requirementsScore);
    const educationScore = this.normalizeScore(analysis.educationScore);
    const { missingCriticalSkills, strengths, gaps, summary } = analysis;
    const penalty = Math.min(
      missingCriticalSkills.length * PENALTY_PER_MISSING_SKILL,
      MAX_PENALTY,
    );

    const overallScore = Math.max(
      0,
      Math.round(
        requiredSkillsScore * WEIGHTS.requiredSkills +
          preferredSkillsScore * WEIGHTS.preferredSkills +
          experienceScore * WEIGHTS.experience +
          requirementsScore * WEIGHTS.requirements +
          educationScore * WEIGHTS.education -
          penalty,
      ),
    );
    return {
      overallScore,
      requiredSkillsScore,
      preferredSkillsScore,
      experienceScore,
      requirementsScore,
      educationScore,
      strengths,
      gaps,
      missingCriticalSkills,
      recommendation: this.getRecommendation(overallScore),
      summary,
    };
  }

  private formatArray(value?: readonly unknown[]): string {
    if (!Array.isArray(value) || value.length === 0) {
      return "Not provided";
    }
    return value
      .map((item) =>
        typeof item === "string" ? item : JSON.stringify(item, null, 2),
      )
      .join("\n");
  }

  private normalizeScore(score: unknown): number {
    const value = typeof score === "number" ? score : Number(score);
    if (Number.isNaN(value)) {
      return 0;
    }
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  private getRecommendation(overallScore: number): ApplicationRecommendation {
    if (overallScore >= 85) {
      return ApplicationRecommendation.STRONG_MATCH;
    }

    if (overallScore >= 70) {
      return ApplicationRecommendation.GOOD_MATCH;
    }

    if (overallScore >= 55) {
      return ApplicationRecommendation.PARTIAL_MATCH;
    }
    return ApplicationRecommendation.POOR_MATCH;
  }

  private extractErrorMeta(error: unknown): {
    status: number | undefined;
    code: string | undefined;
  } {
    if (typeof error !== "object" || error === null) {
      return { status: undefined, code: undefined };
    }

    const status =
      "status" in error ? (error as { status?: number }).status : undefined;
    const code =
      "code" in error ? (error as { code?: string }).code : undefined;
    return { status, code };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
