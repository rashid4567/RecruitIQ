import type { Resume } from "../../domain/entity/Resume.entity";
import type { ResumeRepository } from "../../domain/repository/ResumeRepository";

export class UploadResumeUseCase{
    private readonly repo : ResumeRepository
    constructor( repo : ResumeRepository){
        this.repo = repo;
    }
    
    execute(file : File):Promise<Resume>{
        return this.repo.uploadResume(file);
    }
}