import axios from "axios";
import {
  findUserByEmail,
  createUser,
  createCandidateProfile,
  createRecruiterProfile,
} from "../auth.repo";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import {
  LinkedInTokenResponse,
  LinkedInProfile,
  LinkedInRole,
} from "./linkedin.types";

// Updated LinkedIn userinfo endpoint (OpenID Connect)
const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";

export const linkedinLogin = async (code: string, role: LinkedInRole) => {
  try {
    console.log("🔗 LinkedIn login started for role:", role);
    
    // 1. Exchange code for access token
    const tokenRes = await axios.post<LinkedInTokenResponse>(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;
    console.log("✅ LinkedIn access token received");

    // 2. Get user profile using OpenID Connect userinfo endpoint
    const userInfoRes = await axios.get(
      LINKEDIN_USERINFO_URL,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { email, given_name, family_name, name, sub } = userInfoRes.data;
    
    // Construct full name from available data
    const fullName = name || `${given_name || ""} ${family_name || ""}`.trim() || "LinkedIn User";
    
    console.log("📧 LinkedIn user:", { email, fullName, role, linkedInId: sub });

    if (!email) {
      throw new Error("Email not provided by LinkedIn. Please ensure your LinkedIn account has a verified email.");
    }

    // 3. Find or create user
    let user = await findUserByEmail(email);

    if (!user) {
      console.log("👤 Creating new user from LinkedIn");
      
      // Create user with a random secure password for OAuth users
      const randomPassword = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16);
      
      user = await createUser({
        email,
        password: randomPassword, // OAuth users won't use this
        role,
        fullName,
      });

      // Create role-specific profile
      if (role === "candidate") {
        await createCandidateProfile(user._id.toString());
        console.log("✅ Candidate profile created");
      }

      if (role === "recruiter") {
        await createRecruiterProfile(user._id.toString(), {
          verificationStatus: "pending",
          subscriptionStatus: "free",
        });
        console.log("✅ Recruiter profile created");
      }
      
      console.log("✅ User created from LinkedIn");
    } else {
      console.log("👤 Existing user found:", user._id);
      
      // Verify the role matches
      if (user.role !== role) {
        throw new Error(`This email is already registered as a ${user.role}. Please use the correct login option.`);
      }
    }

    // 4. Generate tokens
    const payload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const tokenData = {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    };

    console.log("✅ LinkedIn auth successful");
    return tokenData;
  } catch (error) {
    console.error("❌ LinkedIn login error:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      });
      
      // Provide more specific error messages
      if (error.response?.status === 401) {
        throw new Error("LinkedIn authentication failed. Please try again.");
      }
      if (error.response?.status === 400) {
        throw new Error("Invalid authorization code. Please try logging in again.");
      }
    }
    
    throw error;
  }
};