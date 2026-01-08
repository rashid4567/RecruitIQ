import { otpModel } from "./otp.model";
import { generateOTP, hashOTP } from "../utils/otp";
import { sendOtp } from "../utils/email";


export const createOTPforEmail = async (
  email: string,
  role: "candidate" | "recruiter"
) => {
  const otp = generateOTP();
  console.log(otp)
  await otpModel.deleteMany({ email });

  await otpModel.create({
    email,
    role,
    otpHash: hashOTP(otp),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  await sendOtp(email, otp);
};


export const verifyOTP = async (
  email: string,
  otp: string,
  role: "candidate" | "recruiter"
) => {
  const record = await otpModel.findOne({ email, role });

  if (!record) {
    throw new Error("OTP expired or invalid");
  }

  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  if (hashOTP(otp) !== record.otpHash) {
    throw new Error("Invalid OTP");
  }

  
  await otpModel.deleteMany({ email, role });
};
