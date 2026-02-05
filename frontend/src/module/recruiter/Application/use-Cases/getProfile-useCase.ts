import type { RecruiterRepository } from "../../Domain/repositories/RecruiterRepository";

export class GetRecruiterProfileUseCase{
    private readonly RecruiterRepo : RecruiterRepository;
    constructor(
        RecruiterRepo : RecruiterRepository
    ){
        this.RecruiterRepo = RecruiterRepo
    }

    async execute(){
        return this.RecruiterRepo.getProfile();
    }
}