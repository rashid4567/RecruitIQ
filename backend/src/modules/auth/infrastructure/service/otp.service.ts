import { otpModel } from "../mongoose/model/otp.model";
import { sentOtp } from "../../../../utils/email";
import { generateOTP, hashOTP } from "../../../../utils/otp";
import { OTPServicePort  } from "../../application/ports/opt.service.ports";

export class OTPService implements OTPServicePort {
    async create(email : string, role : "candidate" | "recruiter"){
        const otp = generateOTP();
        await otpModel.deleteMany({email});

        await otpModel.create({
            email,
            role,
            otpHash : hashOTP(otp),
            expiresAt : new Date(Date.now() + 10 * 60 * 1000)
        });
        await sentOtp(email, otp);
    }

    async verify(email: string, otp: string, role: "candidate" | "recruiter"){
        const record = await otpModel.findOne({email, role});
        if(!record)throw new Error("OTP expired or invalid");
        if(record.expiresAt < new Date())throw new Error("OTP expired");
        if(hashOTP(otp) !== record.otpHash)throw new Error("Invalid OTP");

        await otpModel.deleteMany({email, role})
    }
}