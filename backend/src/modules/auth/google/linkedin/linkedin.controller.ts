import { Request, Response } from "express";
import { linkedinLogin } from "./linkedin.service";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { getError } from "../../utils/getErrorMessage";
import { CookieOptions } from "express";

const getCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };
};

export const redirectToLinkedIn = (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    
    console.log("🔗 LinkedIn redirect request received:", { role });
    console.log("🔗 LinkedIn Client ID:", process.env.LINKEDIN_CLIENT_ID ? "Set" : "Missing");
    console.log("🔗 LinkedIn Redirect URI:", process.env.LINKEDIN_REDIRECT_URI);

    if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET || !process.env.LINKEDIN_REDIRECT_URI) {
      console.error("❌ LinkedIn environment variables missing!");
      return res.status(500).json({
        success: false,
        message: "LinkedIn configuration missing",
      });
    }

    if (!role || !["candidate", "recruiter"].includes(role as string)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Valid role is required (candidate or recruiter)",
      });
    }

    const redirectUri = encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI!);
    const scope = encodeURIComponent("openid profile email");
    const state = Buffer.from(
      JSON.stringify({ role, timestamp: Date.now() })
    ).toString("base64");

    // LinkedIn OAuth URL
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    console.log("🔗 Redirecting to LinkedIn URL:", linkedinAuthUrl);
    res.redirect(linkedinAuthUrl);
  } catch (error) {
    console.error("❌ LinkedIn redirect error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to initiate LinkedIn login",
    });
  }
};

export const handleLinkedInCallback = async (
  req: Request,
  res: Response
) => {
  try {
    const { code, state, error: linkedinError } = req.query;

    console.log("🔄 LinkedIn callback received:", { code, state, linkedinError });

    // Check for LinkedIn errors
    if (linkedinError) {
      console.error("LinkedIn OAuth error:", linkedinError);
      return res.redirect(
        `${process.env.FRONTEND_URL}/signin?error=${encodeURIComponent(
          `LinkedIn authentication failed: ${linkedinError}`
        )}`
      );
    }

    if (!code || !state) {
      console.error("Missing code or state");
      return res.redirect(
        `${process.env.FRONTEND_URL}/signin?error=${encodeURIComponent(
          "Invalid LinkedIn callback"
        )}`
      );
    }

    // Decode state
    let decodedState;
    try {
      decodedState = JSON.parse(
        Buffer.from(state as string, "base64").toString()
      );
    } catch (e) {
      console.error("Failed to decode state:", e);
      return res.redirect(
        `${process.env.FRONTEND_URL}/signin?error=${encodeURIComponent(
          "Invalid authentication state"
        )}`
      );
    }

    const { role } = decodedState;

    console.log("🔑 Processing LinkedIn login for role:", role);

    // Process LinkedIn login
    const data = await linkedinLogin(code as string, role);

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", data.refreshToken, getCookieOptions());

    // Redirect to frontend with access token
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/auth/linkedin/callback`);
    redirectUrl.searchParams.set("accessToken", data.accessToken);
    redirectUrl.searchParams.set("role", data.user.role);
    redirectUrl.searchParams.set("userId", data.user.id.toString());

    console.log("✅ LinkedIn login successful, redirecting to:", redirectUrl.toString());
    res.redirect(redirectUrl.toString());
  } catch (err) {
    console.error("❌ LinkedIn callback error:", err);
    const errorMessage = getError(err);
    res.redirect(
      `${process.env.FRONTEND_URL}/signin?error=${encodeURIComponent(
        `LinkedIn login failed: ${errorMessage}`
      )}`
    );
  }
};