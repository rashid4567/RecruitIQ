import type { ResumeRepository } from "../../domain/repository/ResumeRepository";

export class DownloadResumeUseCase{
    private readonly repo : ResumeRepository;
    constructor(
        repo : ResumeRepository
    ){
        this.repo = repo;
    }

    execute():Promise<string>{
        return this.repo.getDownloadUrl();
    }
}