import { otpModel } from "./otp.model";
import { generateOTP, hashOTP } from "../utils/otp";
import { sendOtp } from "../utils/email";

export const createOTPforEmail = async (email: string) => {
  const otp = generateOTP();
  await otpModel.deleteMany({ email });
  await otpModel.create({
    email,
    otpHash: hashOTP(otp),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  await sendOtp(email, otp);
};

export const verifyOTP = async (email: string, otp: string) => {
  const record = await otpModel.findOne({ email });
  if (!record) throw new Error("OTP expired or invalid");

  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  if (hashOTP(otp) !== record.otpHash) {
    throw new Error("Invalid OTP");
  }

  await otpModel.deleteMany({ email });
};