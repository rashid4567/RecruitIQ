import { ParsedResumeData } from "../entity/resume.entity";

export interface ResumeParser {
  parse(resumeText: string): Promise<ParsedResumeData>;
}