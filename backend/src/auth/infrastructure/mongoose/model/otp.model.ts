import {Schema,model} from "mongoose";


const otpSchema = new Schema({
    email : {
        type : String,
        required : true,
        index : true
    },
    role : {
        type : String,
        enum : ["candidate", "recruiter"],
        required : true,
    },
    otpHash : {
        type : String,
        required : true,
    },
    expiresAt :{
        type : Date,
        required : true,
    },
},
{
    timestamps : true,
})

otpSchema.index({expiresAt : 1},{expireAfterSeconds : 0})

export const otpModel = model("Otp",otpSchema)