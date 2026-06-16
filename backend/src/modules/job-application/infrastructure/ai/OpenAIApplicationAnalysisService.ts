import OpenAI from "openai";
import { z } from "zod";

import {
  ApplicationAnalysis,
  ApplicationAnalysisService,
} from "../../domain/services/ApplicationAnalysisService";

import { Job } from "../../../job/domain/entities/job.entity";
import { Resume } from "../../../resume/domain/entity/resume.entity";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationRecommendation } from "../../domain/entity/job-application.entity";


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
    throw new ApplicationError(
      ERROR_CODES.RESUME_PARSE_NOT_FOUND,
    );
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

Evaluate the candidate objectively.


JOB INFORMATION


Company:
${job.companyName}

Job Title:
${job.title}

Job Description:
${job.description ?? "Not provided"}

Responsibilities:
${this.formatArray(jobData.responsibilities)}

Requirements:
${this.formatArray(jobData.requirements)}

Required Skills:
${this.formatArray(jobData.requiredSkills)}

Preferred Skills:
${this.formatArray(jobData.preferredSkills)}

Experience Required:
${jobData.experienceMin ?? 0} - ${jobData.experienceMax ?? 0} years

Department:
${job.department ?? "Not provided"}

Job Type:
${jobData.jobType ?? "Not provided"}

Remote:
${jobData.isRemote ? "Yes" : "No"}


CANDIDATE INFORMATION


Full Name:
${parsedData.fullName ?? "Not provided"}

Email:
${parsedData.email ?? "Not provided"}

Current Company:
${parsedData.currentCompany ?? "Not provided"}

Current Role:
${parsedData.currentRole ?? "Not provided"}

Total Experience:
${parsedData.totalExperienceYears ?? 0} years

Skills:
${parsedData.skills?.join(", ") || "Not provided"}

Experience:
${experienceText}

Education:
${educationText}

LinkedIn:
${parsedData.linkedin ?? "Not provided"}

GitHub:
${parsedData.github ?? "Not provided"}

Portfolio:
${parsedData.portfolio ?? "Not provided"}

Cover Letter:
${coverLetter ?? "Not provided"}


SCORING RULES


Treat closely related technologies as partial matches.

Examples:

- NestJS implies Node.js experience
- Express.js implies Node.js experience
- React Native implies React knowledge
- PostgreSQL implies SQL knowledge
- AWS Lambda implies AWS experience
- TypeScript implies JavaScript proficiency

Score categories from 0 to 100.

100 = Perfect Match
90  = Exceptional Match
80  = Strong Match
70  = Good Match
60  = Acceptable Match
50  = Weak Match
0–40 = Poor Match

Evaluate:

1. Required Skills Match
2. Preferred Skills Match
3. Experience Alignment
4. Requirements Fulfillment
5. Education Relevance

Return ONLY valid JSON.

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
    candidateName: string | null | undefined,
    jobTitle: string,
  ): Promise<AnalysisResponse> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      console.log(`Application analysis attempt ${attempt}/${MAX_RETRIES}`);

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

        console.log("ATS Analysis", {
          candidate: candidateName,
          jobTitle,
          promptTokens: completion.usage?.prompt_tokens,
          completionTokens: completion.usage?.completion_tokens,
          totalTokens: completion.usage?.total_tokens,
        });

        const content = completion.choices[0]?.message?.content;

        if (!content) {
          throw new ApplicationError(ERROR_CODES.AI_RESPONSE_IS_EMPTY);
        }

        return AnalysisSchema.parse(JSON.parse(content));
      } catch (error: unknown) {
        lastError = error;
        console.log(lastError)
        const { status, code } = this.extractErrorMeta(error);

        console.error(`Application analysis attempt ${attempt} failed`, {
          status,
          code,
          message: error instanceof Error ? error.message : "Unknown error",
        });

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
        console.log(`Retrying application analysis in ${delay}ms…`);
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
