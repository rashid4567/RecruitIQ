import { Types } from "mongoose";
import { getCandidateProfileFromDB, getCandidatesFromDB, updateCandidateStatus } from "./candidate.repo";

export const getCandidateList = async (query : any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;


    const search = query.search || "";
    const status =
  query.status === "Active" || query.status === "Blocked"
    ? query.status
    : "All";



    const {candidates, total} = await getCandidatesFromDB({
        search,
        status,
        skip,
        limit,
    })


    return {
        candidates,
        pagination : {
            page,
            limit,
            total
        }
    }
}
export const getCanidateProfileById = async (candidateId : string) =>{
    if(!Types.ObjectId.isValid(candidateId)){
        throw new Error("Invalid candidate Id")
    }
    const profile = await getCandidateProfileFromDB(candidateId);
    if(!profile){
        throw new Error("candidate not found")
    }
    return profile
}

export const blockCandidateById = async (candidateId : string) =>{
    await updateCandidateStatus(candidateId, false)
}
export const unblockCandidateById = async (candidateId : string) =>{
    await updateCandidateStatus(candidateId,true)
}