import OpenAI from "openai";
import { ParsedResumeData } from "../../domain/entity/resume.entity";

export class ResumeParserService {
  constructor(private readonly openai: OpenAI) {}

  async parse(resumeText: string): Promise<ParsedResumeData> {
    try {
      const normalizedText = resumeText
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 30000);

      const response = await this.openai.responses.create({
        model: "gpt-5-mini",
        input: `
You are an expert Applicant Tracking System (ATS) resume parser.

Extract the candidate information and return ONLY a valid JSON object.

Schema:

{
  "fullName": string | null,
  "email": string | null,
  "phone": string | null,
  "skills": string[],
  "education": string[],
  "experience": string[],
  "totalExperienceYears": number | null,
  "linkedIn": string | null,
  "github": string | null,
  "portfolio": string | null,
  "currentCompany": string | null,
  "currentRole": string | null
}

Rules:
- Return ONLY JSON.
- Do not use markdown.
- Do not use code fences.
- Do not add explanations.
- Use null for missing string values.
- Use [] for missing arrays.
- Deduplicate skills.
- Extract LinkedIn URL if present.
- Extract GitHub URL if present.
- Extract Portfolio URL if present.
- Determine currentCompany from the latest active experience.
- Determine currentRole from the latest active experience.
- Calculate totalExperienceYears if possible.
- Keep skills concise and normalized.
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
        skills: Array.isArray(parsed.skills) ? [...new Set(parsed.skills)] : [],
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
    } catch (error) {
      console.error("Resume parsing failed:", error);
      throw new Error("Failed to parse resume");
    }
  }
}
