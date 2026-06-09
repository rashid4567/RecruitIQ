import type { ResumeRepository } from "../../domain/repository/ResumeRepository";

export class DownloadResumeUseCase {
     private readonly repo: ResumeRepository
  constructor(
    repo : ResumeRepository
  ) {this.repo = repo}

  execute(resumeId: string): Promise<string> {
    return this.repo.getDownloadUrl(resumeId);
  }
}