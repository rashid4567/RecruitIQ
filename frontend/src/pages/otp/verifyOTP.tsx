"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Clock, Shield } from "lucide-react";
import { authService } from "../../services/auth/auth.service";

const OTP_EXPIRY_SECONDS = 60

type VerifyOTPState = {
  email: string;
  fullName: string;
  password: string;
  role: "candidate" | "recruiter";
};


const OTP_STORAGE_KEY = "otp_expiry";
const EMAIL_STORAGE_KEY = "otp_email";

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

  const getSavedExpiryTime = () => {
    const savedExpiry = localStorage.getItem(OTP_STORAGE_KEY);
    const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
    
    if (!savedExpiry || !savedEmail) return null;
    
    const expiryTime = parseInt(savedExpiry, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (currentTime >= expiryTime) {
     
      clearOtpStorage();
      return null;
    }
    
    return { expiryTime, email: savedEmail };
  };

  const saveExpiryTime = (email: string) => {
    const expiryTime = Math.floor(Date.now() / 1000) + OTP_EXPIRY_SECONDS;
    localStorage.setItem(OTP_STORAGE_KEY, expiryTime.toString());
    localStorage.setItem(EMAIL_STORAGE_KEY, email);
    return expiryTime;
  };

  const clearOtpStorage = () => {
    localStorage.removeItem(OTP_STORAGE_KEY);
    localStorage.removeItem(EMAIL_STORAGE_KEY);
  };

  useEffect(() => {
    const locationState = location.state as VerifyOTPState | undefined;
    
    if (!locationState) {
      console.warn("No state found, redirecting to role selection");
      navigate("/role-selection");
      return;
    }

    if (!locationState.email || !locationState.fullName || !locationState.password || !locationState.role) {
      console.error("Missing required fields in state:", locationState);
      navigate("/role-selection");
      return;
    }

    console.log("📨 Received state:", locationState);
    setState(locationState);

    
    const savedData = getSavedExpiryTime();
    const currentEmail = locationState.email.trim().toLowerCase();
    
    if (savedData && savedData.email.toLowerCase() === currentEmail) {

      const currentTime = Math.floor(Date.now() / 1000);
      const remainingTime = Math.max(0, savedData.expiryTime - currentTime);
      setTimeLeft(remainingTime);
      console.log(`⏰ Loaded remaining time from storage: ${remainingTime}s`);
    } else {

      saveExpiryTime(currentEmail);
      setTimeLeft(OTP_EXPIRY_SECONDS);
    }

    setIsLoading(false);
  }, [location, navigate]);

  useEffect(() => {
    if (isLoading || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
   
        if (state && newTime % 10 === 0) {
          saveExpiryTime(state.email.trim().toLowerCase());
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, timeLeft, state]);


  useEffect(() => {
    return () => {
      if (success) {
        clearOtpStorage();
      }
    };
  }, [success]);

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
      clearOtpStorage(); // Clear storage on success
      
      setTimeout(() => {
        if (role === "candidate") {
          navigate("/candidate/profile/complete");
        } else {
          navigate("/recruiter/complete-profile");
        }
      }, 1500);
    } catch (err: any) {
      console.error(" Full OTP Verification Error:", err);
      
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
    if (!state) return;

    setIsResending(true);
    setError("");

    try {
      console.log("🔄 Resending OTP to:", state.email, "with role:", state.role);
      await authService.sendOTP(state.email, state.role);
      
      // Save new expiry time
      saveExpiryTime(state.email.trim().toLowerCase());
      
      setOtp(Array(6).fill(""));
      setTimeLeft(OTP_EXPIRY_SECONDS);
      inputRefs.current[0]?.focus();
      
      // Show success message
      setError("");
      setTimeout(() => {
        // You could add a success toast here
      }, 100);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-600">Loading verification...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Registration Successful!</h2>
            <p className="text-gray-600">Your account has been created successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to profile setup...</p>
          </div>
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Missing Information</h2>
            <p className="text-gray-600">Required information is missing for verification.</p>
            <p className="text-sm text-gray-500">Redirecting to signup...</p>
          </div>
          <button
            onClick={() => navigate("/role-selection")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Go to Sign Up
          </button>
        </div>
      </div>
    );
  }

  const { email, role } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors disabled:opacity-50"
          disabled={isVerifying || isResending}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to signup
        </button>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 p-8 shadow-xl shadow-blue-500/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
            <p className="text-sm text-gray-600 break-all mb-1">{email}</p>
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              <Shield className="w-3 h-3" />
              Registering as <span className="font-semibold ml-1 capitalize">{role}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-50/80 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* OTP Inputs */}
          <div className="mb-8">
            <div className="flex justify-between gap-2 mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  maxLength={1}
                  className="w-14 h-14 border-2 text-center text-2xl font-bold rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={isVerifying || isResending}
                  aria-label={`OTP digit ${i + 1}`}
                />
              ))}
            </div>
            
            {/* Timer */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-500' : 'text-blue-500'}`} />
              <span className={`text-sm font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-gray-600'}`}>
                {timeLeft > 0 ? (
                  <>OTP expires in <span className="font-bold">{formatTime(timeLeft)}</span></>
                ) : (
                  <span className="text-red-600 font-semibold">OTP expired</span>
                )}
              </span>
            </div>

            {/* Paste hint */}
            <p className="text-center text-xs text-gray-500">
              Paste OTP or type each digit
            </p>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying || timeLeft <= 0}
            className={`w-full py-4 px-4 rounded-xl font-bold transition-all duration-300 mb-4 shadow-lg ${
              isVerifying || timeLeft <= 0
                ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl"
            }`}
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-500">
                Didn't receive OTP? Resend in{" "}
                <span className="font-medium text-blue-600">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {isResending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  "Resend OTP"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Your OTP is stored locally and expires automatically
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;