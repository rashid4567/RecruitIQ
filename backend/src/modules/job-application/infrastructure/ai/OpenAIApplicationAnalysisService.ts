import OpenAI from "openai";
import { z } from "zod";

import {
  ApplicationAnalysis,
  ApplicationAnalysisService,
} from "../../domain/services/ApplicationAnalysisService";

import { Job } from "../../../job/domain/entities/job.entity";
import { Resume } from "../../../resume/domain/entity/resume.entity";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

const AnalysisSchema = z.object({
  requiredSkillsScore: z.number(),
  preferredSkillsScore: z.number(),
  experienceScore: z.number(),
  requirementsScore: z.number(),
  educationScore: z.number(),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  missingCriticalSkills: z.array(z.string()),
  summary: z.string(),
});

type AnalysisResponse = z.infer<typeof AnalysisSchema>;

export class OpenAIApplicationAnalysisService implements ApplicationAnalysisService {
  private readonly MAX_RETRIES = 3;

  constructor(private readonly openai: OpenAI) {}

  async analyze(
    job: Job,
    resume: Resume,
    coverLetter?: string,
  ): Promise<ApplicationAnalysis> {
    const parsedData = resume.getParsedData();

    if (!parsedData) {
      throw new Error("Resume has not been parsed");
    }

    const jobData = job.toObject();

    const formatArray = (value?: unknown[]): string => {
      if (!Array.isArray(value) || value.length === 0) {
        return "Not provided";
      }

      return value
        .map((item) =>
          typeof item === "string" ? item : JSON.stringify(item, null, 2),
        )
        .join("\n");
    };

    const experienceText =
      Array.isArray(parsedData.experience) && parsedData.experience.length > 0
        ? parsedData.experience
            .map((exp: any) => {
              if (typeof exp === "string") {
                return exp;
              }

              return `
Role: ${exp.role ?? ""}
Company: ${exp.company ?? ""}
Duration: ${exp.duration ?? ""}
Description: ${exp.description ?? ""}
`;
            })
            .join("\n\n")
        : "Not provided";

    const educationText =
      Array.isArray(parsedData.education) && parsedData.education.length > 0
        ? parsedData.education
            .map((edu: any) => {
              if (typeof edu === "string") {
                return edu;
              }

              return `
Degree: ${edu.degree ?? ""}
Institution: ${edu.institution ?? ""}
Year: ${edu.year ?? ""}
`;
            })
            .join("\n\n")
        : "Not provided";

    const prompt = `
You are both:

1. A Senior Technical Recruiter
2. An Applicant Tracking System (ATS)

Evaluate the candidate objectively.

==================================================
JOB INFORMATION
==================================================

Company:
${job.companyName}

Job Title:
${job.title}

Job Description:
${job.description ?? "Not provided"}

Responsibilities:
${formatArray(jobData.responsibilities)}

Requirements:
${formatArray(jobData.requirements)}

Required Skills:
${formatArray(jobData.requiredSkills)}

Preferred Skills:
${formatArray(jobData.preferredSkills)}

Experience Required:
${jobData.experienceMin ?? 0} -
${jobData.experienceMax ?? 0} years

Department:
${job.department ?? "Not provided"}

Job Type:
${jobData.jobType ?? "Not provided"}

Remote:
${jobData.isRemote ? "Yes" : "No"}

==================================================
CANDIDATE INFORMATION
==================================================

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

==================================================
SCORING RULES
==================================================

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
90 = Exceptional Match
80 = Strong Match
70 = Good Match
60 = Acceptable Match
50 = Weak Match
0-40 = Poor Match

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
`;

    let analysis: AnalysisResponse;
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(
          `Application analysis attempt ${attempt}/${this.MAX_RETRIES}`,
        );

        const completion = await this.openai.chat.completions.create({
          model: "gpt-5-mini",
          temperature: 0,
          response_format: {
            type: "json_object",
          },
          messages: [
            {
              role: "system",
              content: `
You are an ATS candidate evaluation engine.

Rules:
- Return JSON only.
- No markdown.
- No explanations.
- No extra text.
- Scores must be integers between 0 and 100.
`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        console.log("ATS Analysis", {
          candidate: parsedData.fullName,
          jobTitle: job.title,
          promptTokens: completion.usage?.prompt_tokens,
          completionTokens: completion.usage?.completion_tokens,
          totalTokens: completion.usage?.total_tokens,
        });
        const content = completion.choices[0]?.message?.content;

        if (!content) {
          throw new Error("Empty AI response");
        }

        analysis = AnalysisSchema.parse(JSON.parse(content));

        break;
      } catch (error: any) {
        lastError = error;

        const status = error?.status;
        const code = error?.code;

        console.error(`Application analysis attempt ${attempt} failed`, {
          status,
          code,
          message: error?.message,
        });

        if (code === "insufficient_quota") {
          throw new Error("OpenAI quota exceeded. Please check billing.");
        }

        const shouldRetry =
          status === HTTP_STATUS.TOO_MANY_REQUESTS ||
          status === HTTP_STATUS.INTERNAL_SERVER_ERROR ||
          status === HTTP_STATUS.BAD_GATEWAY ||
          status === HTTP_STATUS.SERVICE_UNAVAILABLE ||
          status === HTTP_STATUS.GATEWAY_TIMEOUT ||
          error?.message?.includes("Invalid AI analysis response");

        if (!shouldRetry || attempt === this.MAX_RETRIES) {
          break;
        }

        const delay = Math.pow(2, attempt) * 1000;

        console.log(`Retrying application analysis in ${delay}ms...`);

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (!analysis!) {
      throw new Error(
        `Failed to analyze application after ${this.MAX_RETRIES} attempts: ${
          lastError instanceof Error ? lastError.message : "Unknown error"
        }`,
      );
    }

    const normalizeScore = (score: unknown): number => {
      const value = typeof score === "number" ? score : Number(score);

      if (Number.isNaN(value)) {
        return 0;
      }

      return Math.max(0, Math.min(100, Math.round(value)));
    };

    const requiredSkillsScore = normalizeScore(analysis.requiredSkillsScore);
    const preferredSkillsScore = normalizeScore(analysis.preferredSkillsScore);
    const experienceScore = normalizeScore(analysis.experienceScore);
    const requirementsScore = normalizeScore(analysis.requirementsScore);
    const educationScore = normalizeScore(analysis.educationScore);
    const missingCriticalSkills = Array.isArray(analysis.missingCriticalSkills)
      ? analysis.missingCriticalSkills
      : [];

    const penalty = Math.min(missingCriticalSkills.length * 3, 15);

    const overallScore = Math.max(
      0,
      Math.round(
        requiredSkillsScore * 0.35 +
          preferredSkillsScore * 0.1 +
          experienceScore * 0.25 +
          requirementsScore * 0.2 +
          educationScore * 0.1 -
          penalty,
      ),
    );
    let recommendation:
      | "STRONG_MATCH"
      | "GOOD_MATCH"
      | "PARTIAL_MATCH"
      | "POOR_MATCH";

    if (overallScore >= 85) {
      recommendation = "STRONG_MATCH";
    } else if (overallScore >= 70) {
      recommendation = "GOOD_MATCH";
    } else if (overallScore >= 55) {
      recommendation = "PARTIAL_MATCH";
    } else {
      recommendation = "POOR_MATCH";
    }

    return {
      overallScore,
      requiredSkillsScore,
      preferredSkillsScore,
      experienceScore,
      requirementsScore,
      educationScore,
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      gaps: Array.isArray(analysis.gaps) ? analysis.gaps : [],
      missingCriticalSkills,
      recommendation,
      summary:
        typeof analysis.summary === "string"
          ? analysis.summary
          : "No summary generated.",
    };
  }
}
