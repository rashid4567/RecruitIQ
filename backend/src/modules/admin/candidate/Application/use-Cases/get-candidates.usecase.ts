import { CandidateRepository } from "../../Domain/repositories/candidate.repository";

export class GetcandidateUseCase{
    constructor(
        private readonly candidateRepo : CandidateRepository,
    ){};

    async execute(query : {
        search : string,
        limit : number,
        page : number,
        status : "Active" | "Blocked" | "All"
    }){
        const skip = (query.page - 1) * query.limit;
        const {candidates, total} = await this.candidateRepo.getCandidates({
            search : query.search,
            status : query.status,
            skip,
            limit : query.limit,
        })

        return{
            candidates,
            pagination : {
                page : query.page,
                limit : query.limit,
                skip,
                total,
            }
        }
    }
}