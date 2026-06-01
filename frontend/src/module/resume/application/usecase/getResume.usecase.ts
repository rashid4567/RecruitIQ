import type { Resume } from "../../domain/entity/Resume.entity";
import type { ResumeRepository } from "../../domain/repository/ResumeRepository";

export class getMyResumeUseCase{
    private readonly repo : ResumeRepository
    constructor(repo : ResumeRepository){
        this.repo = repo;
    }

    execute():Promise<Resume>{
        return this.repo.getMyResume();
    }
}