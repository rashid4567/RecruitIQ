"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { authService } from "../../services/auth/auth.service";

const OTP_EXPIRY_SECONDS = 600;

type VerifyOTPState = {
  email: string;
  fullName: string;
  password: string;
  role: "candidate" | "recruiter";
};

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [state, setState] = useState<VerifyOTPState | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const locationState = location.state as VerifyOTPState | undefined;
    
    if (!locationState) {
      console.warn("No state found, redirecting to role selection");
      navigate("/role-selection");
      return;
    }

    // Validate required fields
    if (!locationState.email || !locationState.fullName || !locationState.password || !locationState.role) {
      console.error("Missing required fields in state:", locationState);
      navigate("/role-selection");
      return;
    }

    console.log("📨 Received state:", locationState);
    setState(locationState);
    setIsLoading(false);
  }, [location, navigate]);

  useEffect(() => {
    if (isLoading || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    if (!state) return;
    
    const { email, fullName, password, role } = state;

    if (timeLeft <= 0) {
      setError("OTP has expired. Please resend.");
      return;
    }

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Prepare data for API
      const payload = {
        email: email.trim(),
        otp: otpString,
        password: password,
        fullName: fullName.trim(),
        role: role,
      };

      console.log("📤 Sending OTP verification payload:", payload);

      await authService.verifyOtpAndRegister(payload);

      setSuccess(true);
      setTimeout(() => {
        if (role === "candidate") {
          navigate("/candidate/profile/complete");
        } else {
          navigate("/recruiter/complete-profile");
        }
      }, 1500);
    } catch (err: any) {
      console.error("❌ Full OTP Verification Error:", err);
      
      let errorMessage = "Invalid OTP. Please try again.";
      
      if (err.response) {
        console.error("Error status:", err.response.status);
        console.error("Error data:", err.response.data);
        
        const errorData = err.response.data;
        errorMessage = 
          errorData?.message || 
          errorData?.error || 
          errorData?.details?.[0]?.message || 
          "Invalid OTP. Please try again.";
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = "Something went wrong. Please try again.";
      }
      
      setError(errorMessage);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!state || timeLeft > 0) return;

    setIsResending(true);
    setError("");

    try {
      console.log("🔄 Resending OTP to:", state.email, "with role:", state.role);
      await authService.sendOTP(state.email, state.role);
      setOtp(Array(6).fill(""));
      setTimeLeft(OTP_EXPIRY_SECONDS);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      console.error("Resend error:", err);
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading verification...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Registration Successful</h2>
          <p>Redirecting to profile setup...</p>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold">Missing Information</h2>
          <p>Redirecting to signup...</p>
        </div>
      </div>
    );
  }

  const { email, role } = state;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
          disabled={isVerifying || isResending}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="text-center mb-6">
          <Mail className="w-10 h-10 mx-auto text-blue-600" />
          <h1 className="text-2xl font-bold mt-2">Verify your email</h1>
          <p className="text-sm text-gray-600 break-all">{email}</p>
          <p className="text-xs text-gray-500 mt-1">
            OTP sent to register as <strong>{role}</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="flex justify-between mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              maxLength={1}
              className="w-12 h-12 border text-center text-xl rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isVerifying || isResending}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying || timeLeft <= 0}
          className={`w-full py-3 rounded mb-4 font-semibold transition-all ${
            isVerifying
              ? "bg-gray-400 cursor-not-allowed"
              : timeLeft <= 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isVerifying ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </span>
          ) : (
            "Verify OTP"
          )}
        </button>

        <div className="text-center text-sm">
          {timeLeft > 0 ? (
            <div className="text-gray-600">
              OTP expires in <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-blue-600 font-semibold hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;