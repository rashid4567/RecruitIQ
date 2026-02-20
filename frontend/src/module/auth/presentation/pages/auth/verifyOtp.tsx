import { useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Loader2,
  KeyRound,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useVerifyOtp } from "../../hooks/useVerifyOtp";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const {
    otp,
    timeLeft,
    progress,
    error,
    success,
    state,
    isVerifying,
    isResending,
    maskedEmail,
    formatTime,
    setInputRef,
    handleChange,
    handleKeyDown,
    handlePaste,
    verifyOtp,
    resendOtp,
  } = useVerifyOtp();

  if (success) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="relative mx-auto mb-8 w-24 h-24">
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse-slow" />
            <CheckCircle2 className="relative w-24 h-24 text-emerald-600 mx-auto animate-scale-in" />
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-spin-slow" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Email Verified!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Your account is now secure. Redirecting to profile setup...
          </p>
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50/70 via-purple-50/60 to-blue-50/50 flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 left-20 w-80 h-80 bg-linear-to-br from-purple-200/15 to-pink-100/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative w-full max-w-lg bg-white/75 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 p-8 md:p-10 animate-fade-in-up">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-700 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-2.5 text-sm text-gray-500">
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
            Step 2 of 5
          </div>
        </div>

        <div className="text-center mb-10">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse-slow" />
            <div className="relative p-5 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl">
              <KeyRound className="w-14 h-14 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Verify Your Email
          </h1>
          <p className="text-gray-600 mb-3">Enter the 6-digit code sent to</p>

          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
            <Mail className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-gray-800">{maskedEmail}</span>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Didn't see it? Check spam folder
          </p>
        </div>

        <div className="mb-10" onPaste={handlePaste}>
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Verification code
          </label>

          <div className="flex justify-center gap-3 sm:gap-4 mb-6">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={setInputRef(idx)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                autoComplete="one-time-code"
                aria-label={`Digit ${idx + 1}`}
                disabled={isVerifying}
                className={`w-14 h-16 sm:w-16 sm:h-18 text-center text-3xl font-bold border-2 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-500 shadow-sm
        ${
          digit
            ? "border-indigo-500 bg-linear-to-b from-indigo-50/80 to-white text-indigo-700 shadow-md"
            : "border-gray-300 hover:border-gray-400 bg-white/70 backdrop-blur-sm"
        }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    className="stroke-gray-200 stroke-2 fill-none"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    className={`stroke-indigo-500 stroke-2 fill-none transition-all duration-1000 ${
                      timeLeft < 30 ? "stroke-rose-500" : ""
                    }`}
                    strokeDasharray={88}
                    strokeDashoffset={88 * (1 - progress / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <Clock
                  className={`absolute inset-0 m-auto w-5 h-5 ${
                    timeLeft < 30 ? "text-rose-500" : "text-gray-500"
                  }`}
                />
              </div>
              <span
                className={`font-medium ${
                  timeLeft < 30 ? "text-rose-600" : "text-gray-700"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div
            className={`mb-8 p-5 rounded-2xl flex items-start gap-4 border backdrop-blur-sm shadow-sm animate-fade-in
              ${
                error.includes("sent") || error.includes("inbox")
                  ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
                  : "bg-rose-50/90 border-rose-200 text-rose-800"
              }`}
          >
            {error.includes("sent") || error.includes("inbox") ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-600 mt-0.5 shrink-0" />
            )}
            <p className="text-sm font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <div className="space-y-5">
          <button
            onClick={verifyOtp}
            disabled={isVerifying || otp.join("").length !== 6}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg relative overflow-hidden group
              ${
                otp.join("").length === 6 && !isVerifying
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            {isVerifying ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                Verifying...
              </div>
            ) : (
              <span>Verify & Continue</span>
            )}
          </button>

          <div className="text-center space-y-3">
            {timeLeft <= 0 ? (
              <button
                onClick={resendOtp}
                disabled={isResending}
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors group"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Resend new code
                  </>
                )}
              </button>
            ) : (
              <p className="text-sm text-gray-600">
                Resend available in{" "}
                <span className="font-medium text-gray-800">
                  {formatTime(timeLeft)}
                </span>
              </p>
            )}

            <div className="pt-4 border-t border-gray-200/60">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Secure • Encrypted • No spam</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(10deg);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(20px) rotate(-10deg);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.08);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.7s ease-out forwards;
        }
        
        .animate-float {
          animation: float 18s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 24s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
