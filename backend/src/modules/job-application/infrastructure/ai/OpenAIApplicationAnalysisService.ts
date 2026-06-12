import OpenAI from "openai";

import {
  ApplicationAnalysis,
  ApplicationAnalysisService,
} from "../../domain/services/ApplicationAnalysisService";

import { Job } from "../../../job/domain/entities/job.entity";
import { Resume } from "../../../resume/domain/entity/resume.entity";

type AnalysisResponse = {
  requiredSkillsScore: number;
  preferredSkillsScore: number;
  experienceScore: number;
  requirementsScore: number;
  educationScore: number;
  strengths: string[];
  gaps: string[];
  missingCriticalSkills: string[];
  summary: string;
};

export class OpenAIApplicationAnalysisService implements ApplicationAnalysisService {
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

    const prompt = `
You are a senior ATS system and technical recruiter.

Your task is to evaluate a candidate against a job posting.

Be strict, objective, and realistic.

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
${job.toObject().responsibilities?.join("\n") ?? "Not provided"}

Requirements:
${job.toObject().requirements?.join("\n") ?? "Not provided"}

Required Skills:
${job.toObject().requiredSkills?.join(", ") ?? "Not provided"}

Preferred Skills:
${job.toObject().preferredSkills?.join(", ") ?? "Not provided"}

Experience Required:
${job.toObject().experienceMin ?? 0} -
${job.toObject().experienceMax ?? 0} years

Department:
${job.department ?? "Not provided"}

Job Type:
${job.toObject().jobType ?? "Not provided"}

Remote:
${job.toObject().isRemote ? "Yes" : "No"}

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
${parsedData.experience?.join("\n") || "Not provided"}

Education:
${parsedData.education?.join("\n") || "Not provided"}

LinkedIn:
${parsedData.linkedin ?? "Not provided"}

GitHub:
${parsedData.github ?? "Not provided"}

Portfolio:
${parsedData.portfolio ?? "Not provided"}

Cover Letter:
${coverLetter ?? "Not provided"}

==================================================
SCORING GUIDELINES
==================================================

Score each category from 0 to 100.

100 = Perfect match
90 = Exceptional match
80 = Strong match
70 = Good match
60 = Acceptable match
50 = Weak match
0-40 = Poor match

Missing required skills should significantly reduce scores.

Evaluate:

1. Required skills match
2. Preferred skills match
3. Experience alignment
4. Job requirements fulfillment
5. Education relevance

Identify:

- strengths
- gaps
- missingCriticalSkills

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

    const completion = await this.openai.chat.completions.create({
      model: "gpt-5-mini",
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content:
            "You are an ATS candidate evaluation system. Return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Failed to generate application analysis");
    }
    let analysis: AnalysisResponse;

    try {
      analysis = JSON.parse(content) as AnalysisResponse;
    } catch {
      throw new Error("Invalid AI analysis response");
    }

    const normalizeScore = (score: number): number => {
      if (typeof score !== "number" || Number.isNaN(score)) {
        return 0;
      }
      return Math.max(0, Math.min(100, Math.round(score)));
    };

    const requiredSkillsScore = normalizeScore(analysis.requiredSkillsScore);
    const preferredSkillsScore = normalizeScore(analysis.preferredSkillsScore);
    const experienceScore = normalizeScore(analysis.experienceScore);
    const requirementsScore = normalizeScore(analysis.requirementsScore);
    const educationScore = normalizeScore(analysis.educationScore);
    const missingCriticalSkills = Array.isArray(analysis.missingCriticalSkills)
      ? analysis.missingCriticalSkills
      : [];

    const penalty = Math.min(missingCriticalSkills.length * 5, 20);
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
    if (overallScore >= 90) {
      recommendation = "STRONG_MATCH";
    } else if (overallScore >= 75) {
      recommendation = "GOOD_MATCH";
    } else if (overallScore >= 50) {
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
