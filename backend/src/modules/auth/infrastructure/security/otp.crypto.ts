import crypto from "crypto";

export const generateOTP = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const hashOTP = (otp: string): string =>
  crypto.createHash("sha256").update(otp).digest("hex");