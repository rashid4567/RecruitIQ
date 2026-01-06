import bcrypt from "bcryptjs";
import { verifyOTP } from "../otp/otp.service";
import {
  findUserByEmail,
  createUser,
  createCandidateProfile,
  createRecruiterProfile,
} from "./auth.repo";
import { RegisterInput } from "./auth.types";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

export const RegisterUser = async (data: RegisterInput) => {
  const { email, password, role, fullName, companyName } = data;

  if (!["recruiter", "candidate"].includes(role)) {
    throw new Error("Invalid roles");
  }

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

  if (role === "recruiter") {
    await createRecruiterProfile(user._id.toString(), companyName);
  }
  if (role === "candidate") {
    await createCandidateProfile(user._id.toString());
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

export const verifyOTPAndRegister = async (
  email: string,
  otp: string,
  password: string,
  fullName: string
) => {
  // Verify OTP first
  await verifyOTP(email, otp);

  // Normalize email
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await createUser({
    email: normalizedEmail,
    password: hashedPassword,
    role: "candidate",
    fullName,
  });

  // Create candidate profile
  await createCandidateProfile(user._id.toString());

  // Generate tokens
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