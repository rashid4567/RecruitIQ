import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  Loader2,
  KeyRound,
  UserCheck,
  Lock,
  Sparkles,
} from "lucide-react";
import type { UserRole } from "@/module/auth/domain/constants/user-role";
import { resendOtpUc, verifyOtpUc } from "../../di/auth";

const OTP_EXPIRY_SECONDS = 120;

type VerifyOTPState = {
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
};

const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [state, setState] = useState<VerifyOTPState | null>(null);
  const [isAutoFocused, setIsAutoFocused] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout>();

  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const s = location.state as VerifyOTPState | undefined;
    if (!s) {
      navigate("/role-selection", { replace: true });
      return;
    }
    setState(s);

    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus();
      setIsAutoFocused(true);
    }, 300);

    return () => clearTimeout(focusTimer);
  }, [location, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (error) setError("");

      if (value && index < 5) {
        setTimeout(() => inputRefs.current[index + 1]?.focus(), 10);
      }
    },
    [otp, error],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (e.key === "Enter" && otp.join("").length === 6) {
        handleVerify();
      }
    },
    [otp],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text");
      const numbers = pastedData.replace(/\D/g, "").slice(0, 6);

      if (numbers.length === 6) {
        const newOtp = [...otp];
        numbers.split("").forEach((num, idx) => {
          newOtp[idx] = num;
        });
        setOtp(newOtp);

        setTimeout(() => inputRefs.current[5]?.focus(), 10);
      }
    },
    [otp],
  );

  const handleVerify = async () => {
    if (!state) return;

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (otpAttempts >= 3) {
      setError("Too many attempts. Please request a new OTP.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await verifyOtpUc.execute({
        rawEmail: state.email,
        otp: otpString,
        rawPassword: state.password,
        fullName: state.fullName,
        role: state.role,
      });

      setSuccess(true);
      if (timerRef.current) clearInterval(timerRef.current);

      successTimeoutRef.current = setTimeout(() => {
        navigate(
          state.role === "candidate"
            ? "/candidate/profile/complete"
            : "/recruiter/complete-profile",
        );
      }, 1500);
    } catch (err: any) {
      setOtpAttempts((prev) => prev + 1);
      setError(err.message || "Invalid OTP. Please try again.");

      containerRef.current?.classList.add("animate-shake");
      setTimeout(() => {
        containerRef.current?.classList.remove("animate-shake");
      }, 500);

      if (otpAttempts >= 2) {
        setOtp(Array(6).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!state) return;

    setIsResending(true);
    setError("");

    try {
      await resendOtpUc.execute(state.email, state.role);
      setOtp(Array(6).fill(""));
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setOtpAttempts(0);

     
      setTimeout(() => inputRefs.current[0]?.focus(), 100);

   
      setError("New OTP sent successfully!");
      const clearErrorTimer = setTimeout(() => {
        if (error.includes("successfully")) {
          setError("");
        }
      }, 2000);

      return () => clearTimeout(clearErrorTimer);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };


  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-linear-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-20 animate-pulse" />
            <CheckCircle className="relative w-32 h-32 text-emerald-500 mx-auto animate-scale-in" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Verified Successfully!
          </h1>
          <p className="text-slate-600 mb-8">
            Your email has been verified. Redirecting you to complete your
            profile...
          </p>

          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  /* -------------------- MAIN UI -------------------- */
  const otpString = otp.join("");
  const isOtpComplete = otpString.length === 6;
  const maskedEmail = state.email.replace(
    /(.{2})(.*)(?=@)/,
    ( p1, p2) => p1 + "*".repeat(p2.length),
  );

  const isError = !!error && !error.includes("successfully");
  const isSuccessMessage = !!error && error.includes("successfully");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background elements with animations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-linear-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-linear-to-r from-cyan-100/10 to-blue-100/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div
        ref={containerRef}
        className="relative max-w-md w-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50 animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors group"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-slate-500">Step 2/5</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-20 animate-pulse-slow" />
            <div className="relative p-4 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
              <KeyRound className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Verify Your Email
          </h1>

          <p className="text-slate-600 mb-2">Enter the 6-digit code sent to</p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200 mb-2">
            <Mail className="w-4 h-4 text-slate-500" />
            <span className="font-medium text-slate-800">{maskedEmail}</span>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Check your spam folder if you don't see it
          </p>
        </div>

        {/* OTP Input Container */}
        <div className="mb-10" onPaste={handlePaste}>
          <label
            htmlFor="otp-input-0"
            className="block text-sm font-medium text-slate-700 mb-4 text-center"
          >
            Enter verification code
          </label>

          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <div key={index} className="relative">
                <input
                  id={`otp-input-${index}`}
                  ref={setInputRef(index)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 ${
                    digit
                      ? "border-blue-500 bg-linear-to-b from-blue-50 to-white text-blue-700 shadow-sm"
                      : "border-slate-300 hover:border-slate-400 bg-white"
                  } ${isAutoFocused && index === 0 ? "ring-2 ring-blue-500/20" : ""}`}
                  maxLength={1}
                  autoComplete="one-time-code"
                  aria-label={`Digit ${index + 1} of 6`}
                  disabled={isVerifying}
                />

                {digit && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Timer and attempts */}
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Clock
                className={`w-5 h-5 ${
                  timeLeft < 30 ? "text-rose-500" : "text-slate-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  timeLeft < 30 ? "text-rose-600" : "text-slate-600"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            {otpAttempts > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-amber-600 font-medium">
                  {3 - otpAttempts} {otpAttempts === 1 ? "attempt" : "attempts"}{" "}
                  left
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-fade-in ${
              isSuccessMessage
                ? "bg-emerald-50 border border-emerald-200"
                : isError
                  ? "bg-rose-50 border border-rose-200"
                  : "bg-blue-50 border border-blue-200"
            }`}
          >
            {isSuccessMessage ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : isError ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm font-medium ${
                isSuccessMessage
                  ? "text-emerald-700"
                  : isError
                    ? "text-rose-700"
                    : "text-blue-700"
              }`}
            >
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleVerify}
            disabled={isVerifying || !isOtpComplete}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
              isOtpComplete && !isVerifying
                ? "bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/30"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
            aria-label={
              isOtpComplete ? "Verify OTP" : "Enter complete OTP to verify"
            }
          >
            <div className="relative flex items-center justify-center gap-3">
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify & Continue</span>
                  {isOtpComplete && (
                    <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                </>
              )}
            </div>
            {isOtpComplete && !isVerifying && (
              <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </button>

          <div className="flex flex-col items-center gap-3">
            {timeLeft <= 0 ? (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium transition-colors group"
                aria-label="Resend verification code"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending new code...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Resend verification code</span>
                  </>
                )}
              </button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Didn't receive the code?{" "}
                  <span className="font-medium text-slate-600">
                    Resend available in {formatTime(timeLeft)}
                  </span>
                </p>
                <button
                  onClick={handleResend}
                  disabled={timeLeft > 0 || isResending}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1 disabled:text-slate-400 disabled:cursor-not-allowed"
                  aria-label="Request new OTP"
                >
                  Request new OTP
                </button>
              </div>
            )}

            {/* Security Note */}
            <div className="pt-4 border-t border-slate-200/50 w-full">
              <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                <Shield className="w-3 h-3" />
                <span>
                  Secure verification • Encrypted connection • No spam
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Role Indicator */}
        <div className="mt-8 pt-6 border-t border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg shadow-sm ${
                  state.role === "candidate"
                    ? "bg-linear-to-br from-blue-100 to-blue-50 text-blue-600"
                    : "bg-linear-to-br from-purple-100 to-purple-50 text-purple-600"
                }`}
              >
                {state.role === "candidate" ? (
                  <UserCheck className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700 block">
                  {state.role === "candidate" ? "Candidate" : "Recruiter"}{" "}
                  Account
                </span>
                <span className="text-xs text-slate-500">{state.fullName}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-slate-400">
                Verification
              </div>
              <div className="text-xs text-slate-500">
                Required for security
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles - fixed to avoid JSX attribute error */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-180deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default VerifyOTP;
