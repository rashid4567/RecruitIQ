import { PipelineStage, Types } from "mongoose";
import { CandidateRepository } from "../../Domain/repositories/candidate.repository";
import { UserModel } from "../../../../auth/infrastructure/mongoose/model/user.model";
import { Candidate } from "../../Domain/entities/candidate.entity";

export class MongooseCandidateRepositort implements CandidateRepository{
    async getCandidates({search , status , skip , limit} : any ){
        const match : any = {role : "candidate"};

        if(status === "Active")match.isActive = true;
        if(status === "Blocked")match.isActive = false;

        if(search){
            match.$or = [
                {fullName : {$regex : search , $options : "i"}},
                {email : {$regex : search, $optionss : "i"}},
            ]
        }
        const pipeline : PipelineStage[] = [
            {$match : match},
            {$project : {
                id : "$_id",
                name : "$fullName",
                status : {
                    $cond : [{$eq : ["$isActive",true]}, "Active", "Blocked"],
                },
            },
        },
        {$skip : skip},
        {$limit : limit},
        ]

        const [data, total] = await Promise.all([
            UserModel.aggregate(pipeline),
            UserModel.countDocuments(match)
        ])
        return {
            candidates : data.map(
                (c) => new Candidate(c.id, c.name, c.email, c.status)
            ),
            total,
        }
    }   

    async getCandidateProfile(candidateId: string): Promise<Candidate | null> {
        const result = await UserModel.aggregate([
            {$match : {_id : new Types.ObjectId(candidateId),role : "candidate"}},
            {$lookup : {
                from : "candidateprofiles",
                localField : "_id",
                foreignField : "userId",
                as : "profile"
            },
        },
        {$unwind : {path : "$profile",preserveNullAndEmptyArrays : true}}
        ])

        return result[0] ?? null;
    }

    async updateCandidateStatus(candidateId : string, isActive : boolean){
        await UserModel.findByIdAndUpdate(candidateId, {isActive})
    }
}