import OpenAI from "openai";
import { ParsedResumeData } from "../../domain/entity/resume.entity";
import { HTTP_STATUS } from "../../../../constants/httpStatus";

export class ResumeParserService {
  private readonly MAX_RETRIES = 3;

  constructor(private readonly openai: OpenAI) {}

  async parse(resumeText: string): Promise<ParsedResumeData> {
    const normalizedText = resumeText
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, 15000);

    let lastError: unknown;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`Resume parsing attempt ${attempt}/${this.MAX_RETRIES}`);

        const response = await this.openai.responses.create({
          model: "gpt-5-mini",
          input: `
You are an expert Applicant Tracking System (ATS) resume parser.

Extract the candidate information and return ONLY a valid JSON object.

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

        const content = response.output_text?.trim();

        if (!content) {
          throw new Error("Empty AI response");
        }

        const parsed = JSON.parse(content) as ParsedResumeData;

        return {
          fullName: parsed.fullName ?? null,
          email: parsed.email ?? null,
          phone: parsed.phone ?? null,
          skills: Array.isArray(parsed.skills)
            ? [...new Set(parsed.skills)]
            : [],
          education: Array.isArray(parsed.education) ? parsed.education : [],
          experience: Array.isArray(parsed.experience) ? parsed.experience : [],
          totalExperienceYears:
            typeof parsed.totalExperienceYears === "number"
              ? parsed.totalExperienceYears
              : null,
          linkedin: parsed.linkedin ?? null,
          github: parsed.github ?? null,
          portfolio: parsed.portfolio ?? null,
          currentCompany: parsed.currentCompany ?? null,
          currentRole: parsed.currentRole ?? null,
        };
      } catch (error: any) {
        lastError = error;

        const status = error?.status;
        const code = error?.code;

        console.error(`Resume parsing attempt ${attempt} failed`, {
          status,
          code,
          message: error?.message,
        });

        if (code === "insufficient_quota") {
          throw new Error("OpenAI quota exceeded. Please check billing.");
        }

        if (status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN) {
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

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    console.error("Resume parsing failed after all retries", lastError);

    throw new Error(
  `Failed to parse resume after ${this.MAX_RETRIES} attempts: ${
    lastError instanceof Error
      ? lastError.message
      : "Unknown error"
  }`,
);
  }
}
