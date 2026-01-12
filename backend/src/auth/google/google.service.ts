import { OAuth2Client } from "google-auth-library";
import {
  findUserByEmail,
  createUser,
  createCandidateProfile,
  createRecruiterProfile,
} from "../auth.repo";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginService = async (
  credential: string,
  role?: "candidate" | "recruiter"
) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.email || !payload?.sub) {
    throw new Error("Invalid Google token");
  }

  const email = payload.email.toLowerCase().trim();
  const googleId = payload.sub;
  const fullName = payload.name || "Google User";
  let user = await findUserByEmail(email);

   if (user && user.authProvider === "local") {
    throw new Error("Email already registered using password login");
  }

  

  if (user && role && user.role !== role) {
    throw new Error(
      `This account is already registered as a ${user.role}. Please continue as ${user.role}`
    );
  }
  if (user && !user.isActive) {
    const errorMessage = 
      user.role === "candidate" 
        ? "Your candidate account has been deactivated. Please contact support for assistance."
        : user.role === "recruiter"
        ? "Your recruiter account has been deactivated. Please contact admin for assistance."
        : "Your account has been deactivated. Please contact support.";
    
    throw new Error(errorMessage);
  }
 
  if (!user) {
    if (!role) {
      throw new Error("Role is required for Google signup");
    }
    user = await createUser({
      email,
      password: "",
      role,
      fullName,
      authProvider: "google",
      googleId,
    });

    if (role === "candidate") {
      await createCandidateProfile(user._id.toString());
    }

    if (role === "recruiter") {
      await createRecruiterProfile(user._id.toString(), {
        companyName: `${fullName}'s Company`,
        verificationStatus: "pending",
        subscriptionStatus: "free",
      });
    }
  }

  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  return {
    accessToken: signAccessToken(jwtPayload),
    refreshToken: signRefreshToken(jwtPayload),
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
  };
};
