import bcrypt from "bcryptjs";
import { verifyOTP } from "../otp/otp.service";
import {
  findUserByEmail,
  createUser,
  createCandidateProfile,
  createRecruiterProfile,
} from "./auth.repo";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

export const verifyOTPAndRegister = async (
  email: string,
  otp: string,
  password: string,
  fullName: string,
  role: "candidate" | "recruiter",
  // Remove companyName parameter
) => {
  if (!["candidate", "recruiter"].includes(role)) {
    throw new Error("Invalid role");
  }

  await verifyOTP(email, otp, role);

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error("User already exists");
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({
    email: normalizedEmail,
    password: hashedPassword,
    role,
    fullName,
  });

  if (role === "candidate") {
    await createCandidateProfile(user._id.toString());
  }

  if (role === "recruiter") {
    // Create recruiter profile without companyName initially
    await createRecruiterProfile(user._id.toString(), {
      // No companyName here - will be added in profile completion
      verificationStatus: "pending",
      subscriptionStatus: "free",
    });
  }

  const payload = {
    userId: user._id.toString(),
    role: user.role,
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
  };
};

export const LoginUser = async (email: string, password: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // ✅ Block Google users
  if (!user.password) {
    throw new Error("Please login using Google");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const payload = {
    userId: user._id.toString(),
    role: user.role,
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
  };
};
