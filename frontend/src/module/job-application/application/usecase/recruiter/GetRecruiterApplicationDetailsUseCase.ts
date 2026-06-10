import type { RecruiterApplicationDetails } from "@/module/job-application/domain/dto/RecruiterApplicationDetails";
import type { ApiJobApplicationRepository } from "@/module/job-application/infrastructure/repository/job-application.repository.impl";

export class GetRecruiterApplicationDetailsUseCase{
    private readonly applicationRepo : ApiJobApplicationRepository;
    constructor(applicationRepo : ApiJobApplicationRepository){
        this.applicationRepo = applicationRepo;
    }

    async execute(applicatonId : string):Promise<RecruiterApplicationDetails>{
        return this.applicationRepo.getApplicationDetailsForRecruiter(applicatonId);
    }
}