import crypto from "crypto";

export class OtpHasher {
  hash(otp: string): string {
    return crypto.createHash("sha256").update(otp).digest("hex");
  }
}
