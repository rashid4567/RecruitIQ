import OpenAI from "openai";
import { ParsedResumeData } from "../../domain/entity/resume.entity";

export class ResumeParserService {
  constructor(private readonly openai: OpenAI) {}

  async parse(resumeText: string): Promise<ParsedResumeData> {
    const response = await this.openai.responses.create({
      model: "gpt-5-mini",
      input: `
You are an expert ATS resume parser.

Extract the resume into the exact JSON schema below.

{
  "fullName": string | null,
  "email": string | null,
  "phone": string | null,
  "location": string | null,
  "summary": string | null,

  "skills": string[],

  "education": [
    {
      "degree": string,
      "institution": string,
      "fieldOfStudy": string | null,
      "startYear": string | null,
      "endYear": string | null
    }
  ],

  "experience": [
    {
      "company": string,
      "role": string,
      "startDate": string | null,
      "endDate": string | null,
      "currentlyWorking": boolean,
      "description": string | null
    }
  ],

  "certifications": string[],
  "projects": string[],
  "totalExperienceYears": number | null
}

Rules:
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations.
- If data is missing use null.
- Extract all skills found in the resume.
- Calculate totalExperienceYears if possible.

Resume:
${resumeText}
`,
    });

    const content = response.output_text;

    return JSON.parse(content) as ParsedResumeData;
  }
}