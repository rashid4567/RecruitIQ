import { CandidateRepository } from "../../Domain/repositories/candidate.repository";

export class UnblockCandidteUseCase{
    constructor(
        private readonly candidateRepo : CandidateRepository
    ){};

    async execute(candidateId : string){
        await this.candidateRepo.updateCandidateStatus(candidateId, true);
    }
}