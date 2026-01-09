"use client";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

const LinkedInCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get all parameters
        const accessToken = searchParams.get("accessToken");
        const role = searchParams.get("role");
        const userId = searchParams.get("userId");
        const success = searchParams.get("success");
        const error = searchParams.get("error");

        console.log("🔗 LinkedIn callback params:", {
          hasToken: !!accessToken,
          role,
          userId,
          success,
          error,
        });

        // Check for error parameter first
        if (error) {
          throw new Error(decodeURIComponent(error));
        }

        // Validate success flag
        if (success !== "true") {
          throw new Error("Authentication was not successful");
        }

        // Validate all required data
        if (!accessToken) {
          throw new Error("Access token is missing");
        }

        if (!role || !["candidate", "recruiter"].includes(role)) {
          throw new Error("Invalid or missing role");
        }

        if (!userId) {
          throw new Error("User ID is missing");
        }

        // Store authentication data
        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userId", userId);

        console.log("✅ Authentication data stored successfully");
        setStatus("success");

        // Redirect based on role after a brief delay
        setTimeout(() => {
          if (role === "candidate") {
            console.log("➡️ Redirecting to candidate profile");
            navigate("/candidate/profile", { replace: true });
          } else if (role === "recruiter") {
            console.log("➡️ Redirecting to recruiter profile");
            navigate("/recruiter/complete-profile", { replace: true });
          } else {
            console.log("➡️ Redirecting to home");
            navigate("/", { replace: true });
          }
        }, 1500);
      } catch (error: any) {
        console.error("❌ LinkedIn callback processing error:", error);
        setStatus("error");
        setErrorMessage(
          error.message || "Authentication failed. Please try again."
        );

        // Redirect to signin after showing error
        setTimeout(() => {
          navigate("/signin", { replace: true });
        }, 3000);
      }
    };

    processCallback();
  }, [navigate, searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center space-y-6">
          <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Connecting with LinkedIn...
            </h2>
            <p className="text-slate-600">
              Please wait while we authenticate your account.
            </p>
          </div>
          <div className="w-48 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-slate-100">
        <div className="text-center space-y-6">
          <div className="relative">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">
              LinkedIn Login Successful!
            </h2>
            <p className="text-slate-600 text-lg">
              Redirecting you to your dashboard...
            </p>
          </div>
          <div className="pt-4">
            <div className="w-48 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-slate-100">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="relative">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
          <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">
            LinkedIn Login Failed
          </h2>
          <p className="text-slate-600 text-lg">
            {errorMessage || "Something went wrong during authentication."}
          </p>
          <p className="text-slate-500 text-sm mt-4">
            Redirecting to sign in page...
          </p>
        </div>
        <button
          onClick={() => navigate("/signin", { replace: true })}
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
};

export default LinkedInCallback;