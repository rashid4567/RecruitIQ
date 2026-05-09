import { useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePasswordReset } from "../../hooks/usePasswordReset";
import type { StrengthLevel } from "../../hooks/usePasswordReset";



interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
  state: "idle" | "ok" | "error";
  autoComplete?: string;
}

function PasswordInput({
  id,
  value,
  onChange,
  show,
  onToggle,
  placeholder = "••••••••",
  state,
  autoComplete,
}: PasswordInputProps) {
  return (
    <div className="relative">
      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "w-full pl-10 pr-11 py-3 rounded-xl text-sm border transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-indigo-400/40",
          state === "ok"    && "border-emerald-400 bg-emerald-50/30",
          state === "error" && "border-rose-400    bg-rose-50/30",
          state === "idle"  && "border-slate-200   bg-white hover:border-slate-300"
        )}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}



const BAR_COLOR: Record<StrengthLevel, string> = {
  "empty":     "bg-slate-200",
  "very-weak": "bg-rose-500",
  "weak":      "bg-amber-400",
  "fair":      "bg-amber-500",
  "strong":    "bg-indigo-500",
  "excellent": "bg-emerald-500",
};


const ResetPassword = () => {
  const navigate = useNavigate();

  const {
    token,
    validatingToken,
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    requirements,
    strength,
    errors,
    isSubmitEnabled,
    handleSubmit,
    loading,
  } = usePasswordReset();


  if (validatingToken) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <KeyRound className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">Verifying your link…</p>
            <p className="text-sm text-slate-500 mt-1">This will only take a moment</p>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500 mt-2" />
        </div>
      </div>
    );
  }


  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-5">
            <ShieldAlert className="h-8 w-8 text-rose-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Invalid link</h1>
          <p className="text-sm text-slate-500 mb-7">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => navigate("/signin")}
            className="w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }


  const passwordFieldState: "idle" | "ok" | "error" =
    errors.password                                              ? "error"
    : password && (strength.level === "strong" || strength.level === "excellent") ? "ok"
    : "idle";

  const confirmFieldState: "idle" | "ok" | "error" =
    errors.confirm                                  ? "error"
    : confirmPassword && password === confirmPassword ? "ok"
    : "idle";

  return (
    <div className="min-h-screen bg-slate-50/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-7">
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </button>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              Secure reset
            </span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
              <KeyRound className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">Set new password</h1>
              <p className="text-sm text-slate-500 mt-1">Create a strong password for your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            <div>
              <label htmlFor="pw" className="block text-sm font-medium text-slate-700 mb-1.5">
                New password
              </label>
              <PasswordInput
                id="pw"
                value={password}
                onChange={setPassword}
                show={showPassword}
                onToggle={toggleShowPassword}
                autoComplete="new-password"
                state={passwordFieldState}
              />
              {errors.password && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>

            {password && (
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">

                {/* Bar + label row */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        BAR_COLOR[strength.level]
                      )}
                      style={{ width: `${strength.pct}%` }}
                    />
                  </div>
                  <span className={cn("text-xs font-semibold w-16 text-right shrink-0", strength.color)}>
                    {strength.label}
                  </span>
                </div>

                {/* Requirements — 2-col grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {requirements.map((req) => (
                    <div
                      key={req.label}
                      className={cn(
                        "flex items-center gap-1.5 text-[12px] transition-colors",
                        req.met ? "text-emerald-700" : "text-slate-400"
                      )}
                    >
                      {req.met
                        ? <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        : <X    className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                      }
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm password */}
            <div>
              <label htmlFor="cpw" className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm password
              </label>
              <PasswordInput
                id="cpw"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showConfirmPassword}
                onToggle={toggleShowConfirmPassword}
                autoComplete="new-password"
                state={confirmFieldState}
              />

              {errors.confirm ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.confirm}
                </p>
              ) : confirmPassword && password === confirmPassword ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  Passwords match
                </p>
              ) : null}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isSubmitEnabled || loading}
              className={cn(
                "w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150",
                "flex items-center justify-center gap-2",
                isSubmitEnabled && !loading
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.99]"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Reset password
                </>
              )}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-4">
          Didn't request a reset?{" "}
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="underline hover:text-slate-600 transition-colors"
          >
            Sign in instead
          </button>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;