import OpenAI from "openai";
import { z } from "zod";

import { ParsedResumeData } from "../../domain/entity/resume.entity";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { ERROR_CODES } from "../../../../shared/constants/errorcode.constants";

const ResumeSchema = z.object({
  fullName: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  skills: z.array(z.string()).default([]),
  education: z.array(z.string()).default([]),
  experience: z.array(z.string()).default([]),
  totalExperienceYears: z.number().nullable(),
  linkedin: z.string().nullable(),
  github: z.string().nullable(),
  portfolio: z.string().nullable(),
  currentCompany: z.string().nullable(),
  currentRole: z.string().nullable(),
});

export class ResumeParserService {
  private readonly MAX_RETRIES = 3;
  private readonly MAX_RESUME_LENGTH = 15000;

  constructor(private readonly openai: OpenAI) {}

  async parse(resumeText: string): Promise<ParsedResumeData> {
    const normalizedText = this.normalizeResumeText(resumeText);
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`Resume parsing attempt ${attempt}/${this.MAX_RETRIES}`);

        const response = await this.openai.responses.create({
          model: "gpt-5-mini",
          input: `
You are an expert ATS resume parser.
Extract resume information and return ONLY a valid JSON object.

{
  "fullName": string | null,
  "email": string | null,
  "phone": string | null,
  "skills": string[],
  "education": string[],
  "experience": string[],
  "totalExperienceYears": number | null,
  "linkedin": string | null,
  "github": string | null,
  "portfolio": string | null,
  "currentCompany": string | null,
  "currentRole": string | null
}
Resume:

${normalizedText}
`,
        });

        console.log("Resume Parser Usage:", {
          inputTokens: response.usage?.input_tokens,
          outputTokens: response.usage?.output_tokens,
          totalTokens: response.usage?.total_tokens,
        });

        const content = response.output_text?.trim();
        if (!content) {
          throw new Error("Empty AI response");
        }
        const parsed = this.parseAndValidateResponse(content);
        return {
          fullName: parsed.fullName ?? null,
          email: parsed.email ?? null,
          phone: parsed.phone ?? null,
          skills: [...new Set(parsed.skills)],
          education: parsed.education,
          experience: parsed.experience,
          totalExperienceYears: parsed.totalExperienceYears,
          linkedin: parsed.linkedin ?? null,
          github: parsed.github ?? null,
          portfolio: parsed.portfolio ?? null,
          currentCompany: parsed.currentCompany ?? null,
          currentRole: parsed.currentRole ?? null,
        };
      } catch (error: unknown) {
        lastError = error;

        const status =
          typeof error === "object" && error !== null && "status" in error
            ? (error as { status?: number }).status
            : undefined;

        const code =
          typeof error === "object" && error !== null && "code" in error
            ? (error as { code?: string }).code
            : undefined;

        const message =
          error instanceof Error ? error.message : "Unknown error";

        console.error(`Resume parsing attempt ${attempt} failed`, {
          status,
          code,
          message,
        });

        if (code === "insufficient_quota") {
          throw new ApplicationError(ERROR_CODES.AI_QUOTA_EXCEEDED);
        }
        if (
          status === HTTP_STATUS.UNAUTHORIZED ||
          status === HTTP_STATUS.FORBIDDEN
        ) {
          throw error;
        }
        const shouldRetry =
          status === HTTP_STATUS.TOO_MANY_REQUESTS ||
          status === HTTP_STATUS.INTERNAL_SERVER_ERROR ||
          status === HTTP_STATUS.BAD_GATEWAY ||
          status === HTTP_STATUS.SERVICE_UNAVAILABLE ||
          status === HTTP_STATUS.GATEWAY_TIMEOUT;

        if (!shouldRetry || attempt === this.MAX_RETRIES) {
          break;
        }

        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying resume parsing in ${delay}ms...`);
        await this.sleep(delay);
      }
    }

    console.error("Resume parsing failed after all retries", lastError);
    throw new ApplicationError(ERROR_CODES.RESUME_PARSE_FAILED);
  }

  private normalizeResumeText(text: string): string {
    return text
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, this.MAX_RESUME_LENGTH);
  }

  private parseAndValidateResponse(content: string) {
    try {
      const parsed = JSON.parse(content);
      return ResumeSchema.parse(parsed);
    } catch (error) {
      console.error("Invalid resume parser response:", content);
      console.log("error :", error);
      throw new Error("Invalid AI response format");
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
