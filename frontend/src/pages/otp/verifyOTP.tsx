"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { authService } from "../../services/auth.service";

const OTP_EXPIRY_SECONDS = 600; // 10 minutes

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email as string;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  const getRegistrationData = () => {
    const data = sessionStorage.getItem("candidateRegData");
    if (!data) {
      navigate("/signup");
      return null;
    }
    return JSON.parse(data);
  };

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

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

  const handlePaste = (e: React.ClipboardEvent) => {
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
      const regData = getRegistrationData();
      if (!regData) return;

      const response = await authService.verifyCandidate({
        email: regData.email,
        otp: otpString,
        password: regData.password,
        fullName: regData.fullName,
      });

      const accessToken = response.data?.accessToken || response.data?.data?.accessToken;
      const user = response.data?.user || response.data?.data?.user;

      if (!accessToken || !user) {
        throw new Error("Invalid response structure from server");
      }

    
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userId", user.id);

      

      sessionStorage.removeItem("candidateRegData");

      setSuccess(true);

      setTimeout(() => {
        navigate("/candidate/profile");
      }, 1500);
    } catch (err: any) {
      console.error("❌ OTP Verification Error:", err);
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;

    setIsResending(true);
    setError("");

    try {
      await authService.sendCandidateOtp(email);
      setOtp(Array(6).fill(""));
      setTimeLeft(OTP_EXPIRY_SECONDS);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  /* ======================
     Success screen
     ====================== */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Registration Successful</h2>
          <p>Redirecting to profile completion...</p>
        </div>
      </div>
    );
  }

  /* ======================
     UI
     ====================== */
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft />
        </button>

        <div className="text-center mb-6">
          <Mail className="w-10 h-10 mx-auto text-blue-600" />
          <h1 className="text-2xl font-bold mt-2">Verify your email</h1>
          <p className="text-sm text-gray-600">{email}</p>
        </div>

        {error && (
          <div className="mb-4 flex gap-2 items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
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
              className="w-12 h-12 border text-center text-xl rounded"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full bg-blue-600 text-white py-3 rounded mb-4"
        >
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center text-sm text-gray-600">
          {timeLeft > 0 ? (
            <>Expires in {formatTime(timeLeft)}</>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-blue-600 font-semibold"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;