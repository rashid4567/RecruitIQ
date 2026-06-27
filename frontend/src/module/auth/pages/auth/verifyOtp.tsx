import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  Loader2,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { useVerifyOtp } from "../../hooks/useVerifyOtp";

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="relative mx-auto mb-8 w-32 h-32">
          <div className="absolute inset-0 bg-emerald-300/30 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-32 h-32 rounded-full bg-white border-2 border-emerald-100 shadow-2xl shadow-emerald-100 flex items-center justify-center">
            <CheckCircle
              className="w-16 h-16 text-emerald-500 animate-scale-pop"
              strokeWidth={1.5}
            />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-amber-400 animate-spin-slow" />
        </div>
        <h1 className="text-[32px] font-bold text-gray-900 tracking-tight mb-3">
          Email Verified!
        </h1>
        <p className="text-gray-500 text-base mb-10 max-w-xs mx-auto leading-relaxed">
          Your account is secure. Taking you to your profile setup…
        </p>
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-full border border-emerald-100 shadow-sm text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          Redirecting you now…
        </div>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scale-pop {
          0%   { transform: scale(0);    opacity: 0; }
          70%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        .animate-spin-slow  { animation: spin-slow  8s linear   infinite; }
        .animate-scale-pop  { animation: scale-pop  0.55s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50/70 via-purple-50/60 to-blue-50/50 flex items-center justify-center">
      <Loader2 className="w-9 h-9 text-indigo-500 animate-spin" />
    </div>
  );
}

function TimerArc({
  progress,
  timeLeft,
  formatTime,
}: {
  progress: number;
  timeLeft: number;
  formatTime: (s: number) => string;
}) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const isUrgent = timeLeft < 30;

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-12 h-12 shrink-0">
        <svg viewBox="0 0 56 56" className="-rotate-90 w-full h-full">
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke={isUrgent ? "rgba(239,68,68,0.12)" : "rgba(99,102,241,0.1)"}
            strokeWidth="3"
          />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke={isUrgent ? "#f87171" : "url(#tg)"}
            strokeWidth="3"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress / 100)}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s linear, stroke 0.4s ease",
            }}
          />
          <defs>
            <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-[9px] font-mono font-bold tabular-nums leading-none ${isUrgent ? "text-rose-500" : "text-indigo-600"}`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      <div className="leading-tight">
        <p
          className={`text-[11px] font-medium ${isUrgent ? "text-rose-500" : "text-gray-400"}`}
        >
          {isUrgent ? "Expiring soon!" : "Code expires in"}
        </p>
        <p
          className={`text-sm font-bold tabular-nums ${isUrgent ? "text-rose-600" : "text-gray-700"}`}
        >
          {formatTime(timeLeft)}
        </p>
      </div>
    </div>
  );
}

function OtpBox({
  digit,
  idx,
  setInputRef,
  handleChange,
  handleKeyDown,
  isVerifying,
  hasError,
}: {
  digit: string;
  idx: number;
  setInputRef: (i: number) => (el: HTMLInputElement | null) => void;
  handleChange: (i: number, v: string) => void;
  handleKeyDown: (i: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  isVerifying: boolean;
  hasError: boolean;
  isFocused?: boolean;
}) {
  const filled = !!digit;
  const errored = hasError && !filled;

  return (
    <div className="relative group">
      {filled && (
        <div className="absolute inset-0 rounded-2xl bg-indigo-400/20 blur-md scale-110 pointer-events-none" />
      )}

      <input
        ref={setInputRef(idx)}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        value={digit}
        onChange={(e) => handleChange(idx, e.target.value)}
        onKeyDown={(e) => handleKeyDown(idx, e)}
        autoComplete="one-time-code"
        aria-label={`Digit ${idx + 1} of 6`}
        disabled={isVerifying}
        className={[
          "relative w-12 h-15 sm:w-13 sm:h-16",
          "text-center text-[26px] font-bold tracking-tight",
          "rounded-2xl border-2 outline-none",
          "transition-all duration-200",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          errored
            ? "border-rose-400 bg-rose-50/80 text-rose-600 shadow-sm shadow-rose-100"
            : filled
              ? "border-indigo-500 bg-white text-indigo-700 shadow-lg shadow-indigo-200/60"
              : "border-gray-200 bg-white/60 backdrop-blur-sm text-gray-900 hover:border-indigo-300 hover:bg-white/80 focus:border-indigo-500 focus:bg-white focus:shadow-lg focus:shadow-indigo-100/60",
        ].join(" ")}
      />


      <div
        className={[
          "absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300",
          filled ? "w-5 bg-indigo-500" : "w-0 bg-transparent",
        ].join(" ")}
      />
    </div>
  );
}

function OtpInput({
  otp,
  setInputRef,
  handleChange,
  handleKeyDown,
  handlePaste,
  isVerifying,
  hasError,
}: {
  otp: string[];
  setInputRef: (i: number) => (el: HTMLInputElement | null) => void;
  handleChange: (i: number, v: string) => void;
  handleKeyDown: (i: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  isVerifying: boolean;
  hasError: boolean;
}) {
  return (
    <div onPaste={handlePaste} className="flex justify-center gap-2 sm:gap-3">
      {otp.map((digit, idx) => (
        <OtpBox
          key={idx}
          digit={digit}
          idx={idx}
          setInputRef={setInputRef}
          handleChange={handleChange}
          handleKeyDown={handleKeyDown}
          isVerifying={isVerifying}
          hasError={hasError}
        />
      ))}
    </div>
  );
}

function StepProgress() {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((step) => (
        <div
          key={step}
          className={[
            "rounded-full transition-all duration-500",
            step === 1
              ? "w-5 h-1.5 bg-indigo-400"
              : step === 2
                ? "w-5 h-1.5 bg-indigo-600"
                : "w-2 h-1.5 bg-gray-200",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

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

  if (success) return <SuccessScreen />;
  if (!state) return <LoadingScreen />;

  const otpFilled = otp.join("").length === 6;
  const filledCount = otp.filter(Boolean).length;
  const isSuccessMsg =
    !!error && (error.includes("sent") || error.includes("inbox"));
  const hasError = !!error && !isSuccessMsg;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50/80 via-purple-50/70 to-blue-50/60 flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-40 w-120 h-120 rounded-full bg-linear-to-br from-indigo-300/20 to-purple-300/15 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-linear-to-br from-purple-200/20 to-pink-200/10 blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-125 rounded-full bg-linear-to-br from-blue-100/15 to-indigo-100/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-linear(circle, #6366f1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-700 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
          Back
        </button>

        <StepProgress />

        <span className="text-xs font-semibold text-gray-400 tabular-nums">
          2 / 5
        </span>
      </nav>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-105 animate-fade-up">
          <div className="text-center mb-7">
            <div className="relative inline-flex mb-5">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-500 rounded-4xl blur-xl opacity-30 scale-110 animate-pulse" />
              <div className="relative w-17 h-17 bg-linear-to-br from-indigo-600 to-purple-600 rounded-4xl shadow-xl shadow-indigo-300/40 flex items-center justify-center">
                <KeyRound className="w-8 h-8 text-white" strokeWidth={1.75} />
              </div>
            </div>

            <h1 className="text-[30px] font-bold text-gray-900 tracking-tight leading-tight mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">
              We sent a 6-digit code to
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-indigo-100 shadow-md shadow-indigo-50">
              <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <Mail className="w-3 h-3 text-indigo-500" />
              </div>
              <span className="text-sm font-semibold text-gray-800 tracking-tight">
                {maskedEmail}
              </span>
            </div>

            <p className="text-[11px] text-gray-400 mt-2.5">
              Can't find it? Check your spam or junk folder.
            </p>
          </div>

          <div className="relative mb-4">
            <div className="absolute -inset-0.5 rounded-[28px] bg-linear-to-br from-indigo-400/40 via-purple-400/30 to-blue-400/20 blur-sm pointer-events-none" />
            <div className="absolute -inset-px rounded-[28px] bg-linear-to-br from-indigo-300/60 via-purple-300/40 to-blue-300/30 pointer-events-none" />

            <div className="relative bg-white/80 backdrop-blur-2xl rounded-[26px] border border-white/90 shadow-2xl shadow-indigo-200/50 overflow-hidden">
              <div className="h-0.75 w-full bg-linear-to-r from-indigo-500 via-purple-500 to-blue-400" />

              <div className="px-7 pt-7 pb-7">
                <div className="flex justify-center gap-1.5 mb-5">
                  {otp.map((d, i) => (
                    <div
                      key={i}
                      className={[
                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                        d ? "bg-indigo-500 scale-110" : "bg-gray-200",
                      ].join(" ")}
                    />
                  ))}
                </div>

                <p className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-4">
                  Verification Code
                </p>

                <OtpInput
                  otp={otp}
                  setInputRef={setInputRef}
                  handleChange={handleChange}
                  handleKeyDown={handleKeyDown}
                  handlePaste={handlePaste}
                  isVerifying={isVerifying}
                  hasError={hasError}
                />

                <div className="mt-5 mb-1 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${(filledCount / 6) * 100}%` }}
                  />
                </div>
                <p className="text-center text-[11px] text-gray-400 mb-6">
                  {filledCount === 6
                    ? "All digits entered ✓"
                    : `${filledCount} of 6 digits entered`}
                </p>

                <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-5" />

                <div className="flex items-center justify-between mb-6">
                  <TimerArc
                    progress={progress}
                    timeLeft={timeLeft}
                    formatTime={formatTime}
                  />

                  <div className="text-right">
                    <p className="text-[11px] text-gray-400 mb-1">
                      Didn't get the code?
                    </p>
                    {timeLeft <= 0 ? (
                      <button
                        onClick={resendOtp}
                        disabled={isResending}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50 group"
                      >
                        {isResending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                            Resend code
                          </>
                        )}
                      </button>
                    ) : (
                      <p className="text-xs text-gray-400">
                        Resend in{" "}
                        <span className="font-bold text-gray-600 tabular-nums">
                          {formatTime(timeLeft)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div
                    className={[
                      "flex items-start gap-3 px-4 py-3.5 rounded-2xl mb-5 text-sm border",
                      "animate-fade-up transition-all",
                      isSuccessMsg
                        ? "bg-emerald-50 border-emerald-200/80 text-emerald-700"
                        : "bg-rose-50 border-rose-200/80 text-rose-700",
                    ].join(" ")}
                  >
                    {isSuccessMsg ? (
                      <CheckCircle
                        className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500"
                        strokeWidth={1.5}
                      />
                    ) : (
                      <AlertCircle
                        className="w-4 h-4 mt-0.5 shrink-0 text-rose-500"
                        strokeWidth={1.5}
                      />
                    )}
                    <span className="font-medium leading-snug">{error}</span>
                  </div>
                )}

                <button
                  onClick={verifyOtp}
                  disabled={!otpFilled || isVerifying}
                  className={[
                    "w-full h-13 rounded-2xl font-semibold text-[15px]",
                    "flex items-center justify-center gap-2",
                    "transition-all duration-200",
                    otpFilled && !isVerifying
                      ? [
                          "bg-linear-to-r from-indigo-600 to-purple-600",
                          "hover:from-indigo-700 hover:to-purple-700",
                          "text-white",
                          "shadow-lg shadow-indigo-300/50",
                          "hover:shadow-xl hover:shadow-indigo-300/60",
                          "hover:-translate-y-0.5",
                          "active:translate-y-0 active:shadow-md",
                        ].join(" ")
                      : "bg-gray-100 text-gray-400 cursor-not-allowed",
                  ].join(" ")}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      Verify & Continue
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck
              className="w-3.5 h-3.5 text-emerald-500 shrink-0"
              strokeWidth={1.5}
            />
            <span>End-to-end encrypted · Secure · No spam</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0)    rotate(0deg);  }
          50%       { transform: translateY(-24px) rotate(7deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0)   rotate(0deg);   }
          50%       { transform: translateY(18px) rotate(-7deg); }
        }
        .animate-fade-up    { animation: fade-up    0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
        .animate-float      { animation: float      20s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 26s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
