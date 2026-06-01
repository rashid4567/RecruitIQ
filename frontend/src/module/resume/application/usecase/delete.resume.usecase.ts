import type { ResumeRepository } from "../../domain/repository/ResumeRepository";

export class deleteResumeUseCase{
    private readonly repo : ResumeRepository;
    constructor(
        repo : ResumeRepository
    ){
        this.repo = repo
    }

    execute():Promise<void>{
        return this.repo.deleteResume();
    }
}