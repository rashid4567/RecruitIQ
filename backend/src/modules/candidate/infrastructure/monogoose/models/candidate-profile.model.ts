import { Schema, model, Types } from "mongoose";

const candidateProfileSchema = new Schema ({
    userId : {
        type : Types.ObjectId,
        ref : "User",
        required : true,
        unique : true,
    },
    currentJob : {
         type : String,
    },
    experienceYears : {
        type : Number,
        default : 0,
    },
    educationLevel : {
        type : String,
        enum : ["highschool","diploma","Bachelor", "master", "phd"],
    },
    skills : {
        type : [String],
        default  : [],
    },
    preferredJobLocations : {
        type :[String],
        default : [],
    },
    bio : {
        type : String,
    },
    currentJobLocation : {
        type : String,
    },
    gender : {
        type : String,
        enum : ['Male', "female","other"],
    },
    linkedinUrl : {
        type : String,
    },
    portfolioUrl : {
        type : String,
    },
    profileCompleted : {
        type : Boolean,
        default : false,
    },
},
{
    timestamps : true,
})

export const candidateProfileModel = model("candidateProfile",candidateProfileSchema) 