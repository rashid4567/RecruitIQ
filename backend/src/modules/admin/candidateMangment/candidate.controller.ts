import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import { blockCandidateById, getCandidateList, getCanidateProfileById, unblockCandidateById } from "./candidate.service";
import { success } from "zod";



export const getCandidate = async (req : Request, res : Response) =>{
    try{
        const data = await getCandidateList(req.query);
        res.status(HTTP_STATUS.OK).json({
            success : true,
            data,
        })
    }catch(err){
        console.error("candidateMangment error : ", err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "Failed to fetch Candidate"
        })
    }
}
export const getCandidateProfile = async (req : Request, res : Response) =>{
    try{
        
        const {candidateId} = req.params;
        console.log("Candidate ID:", req.params.candidateId);

        const data = await getCanidateProfileById(candidateId);
        res.status(HTTP_STATUS.OK).json({
            success : true,
            data,
        })
    }catch(err){
        console.error("getCandidate prfile error : ", err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "Unable to fetch the candidate profile page"
        })
    }
}

export const blockCandidate = async (req : Request, res : Response) =>{
    try{
        const {candidateId} = req.params;
        await blockCandidateById(candidateId)
        res.status(HTTP_STATUS.OK).json({
            success : true,
            message : "Candiate blocked succesfully"
        })
    }catch(err){
        console.error('Block Candidate error : ',err);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "Unable to block the candidate",
        })
    }
}

export const unblockCandidate = async (req : Request, res : Response) =>{
    try{
        const {candidateId} = req.params;
        await unblockCandidateById(candidateId);

        res.status(HTTP_STATUS.OK).json({
            success : true,
            message : "Candidate unblocked succesfully",
        })
    }catch(err){
        console.error("error in Unblocking candidate : error",err)
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "Unable to unblock the Canidate"
        })
    }
}