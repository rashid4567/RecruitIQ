import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { FileStorageRepository } from "../../domain/repository/fileStorage.repository";
import { ResumeRepository } from "../../domain/repository/resume.repository";

export class DownloadResumeUseCase {
    constructor(
        private readonly resumeRepo : ResumeRepository,
        private readonly fileStorageRepo : FileStorageRepository
    ){};

    async execute(resumeId :string):Promise<string>{
        const resume = await this.resumeRepo.findById(resumeId);
        if(!resume){
            throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND)
        }
        return this.fileStorageRepo.getDownloadUrl(
            resume.getFileKey(),
            resume.getFileName(),
        )
    }
}