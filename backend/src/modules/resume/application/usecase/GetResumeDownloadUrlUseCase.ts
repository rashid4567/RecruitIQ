import { ERROR_CODES } from "../../../../constants/errorcode.constants";
import { ApplicationError } from "../../../../shared/errors/application.error";
import { FileStorageRepository } from "../../domain/repository/fileStorage.repository";
import { ResumeRepository } from "../../domain/repository/resume.repository";
import { GetResumeDownloadUrlDTO } from "../dto/get-resume-download-url.dto";


export class GetResumeDownLoadUrlUseCase{
    constructor(
        private readonly resumeRepo : ResumeRepository,
        private readonly fileStorageRepo : FileStorageRepository
    ){};

    async execute(
        dto : GetResumeDownloadUrlDTO
    ):Promise<string>{
        const resume = await this.resumeRepo.findByCandidateId(dto.candidateId)

        if(!resume){
            throw new ApplicationError(ERROR_CODES.RESUME_NOT_FOUND)
        }

        return await this.fileStorageRepo.getDownloadUrl(resume.getFileKey(), resume.getFileName())
    }
}