import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { forgotPasswordUc } from "../../di/auth";
import { useForgotPassword } from "../../hooks/useForgotPassword";

function FieldError({ message, id }: { message: string; id: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 flex items-start gap-1.5 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200"
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-px" aria-hidden="true" />
      {message}
    </p>
  );
}

function ServerErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 animate-in slide-in-from-top-2 duration-300"
    >
      <AlertCircle
        className="h-5 w-5 shrink-0 mt-px text-red-500"
        aria-hidden="true"
      />
      <span>{message}</span>
    </div>
  );
}

const ForgotPassword = () => {
  const {
    email,
    errors,
    isLoading,
    isSubmitted,
    resendCooldown,
    canResend,
    handleEmailChange,
    handleSubmit,
    handleResend,
  } = useForgotPassword((email: string) => forgotPasswordUc.execute(email));

  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!isSubmitted) emailRef.current?.focus();
  }, [isSubmitted]);

  return (
    <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Geist','Inter',sans-serif]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.06),transparent)]"
      />

      <div className="relative w-full max-w-105">
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_4px_32px_-4px_rgba(0,0,0,0.10)] overflow-hidden">
          <div className="px-8 pt-7 pb-0 flex items-center justify-between">
            <Link
              to="/signin"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
              Back to sign in
            </Link>

            {!isSubmitted && (
              <span className="text-xs font-medium text-gray-400 tracking-wide uppercase">
                Step 1 / 2
              </span>
            )}
          </div>

          <div className="px-8 pt-8 pb-6 text-center">
            <div
              className={`
                mx-auto mb-5 w-18 h-18 rounded-2xl flex items-center justify-center
                transition-all duration-500 ease-out
                ${
                  isSubmitted
                    ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                    : "bg-blue-50 text-blue-600 ring-1 ring-blue-100"
                }
              `}
            >
              {isSubmitted ? (
                <CheckCircle2
                  className="h-9 w-9"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              ) : (
                <Mail
                  className="h-9 w-9"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              )}
            </div>

            <h1 className="text-[1.6rem] font-bold text-gray-900 tracking-tight leading-tight">
              {isSubmitted ? "Check your inbox" : "Reset your password"}
            </h1>

            <p className="mt-2.5 text-[0.9375rem] text-gray-500 leading-relaxed">
              {isSubmitted ? (
                <>
                  We sent a reset link to{" "}
                  <strong className="font-semibold text-gray-800 break-all">
                    {email}
                  </strong>
                  . It may take a minute to arrive.
                </>
              ) : (
                "Enter your email and we'll send you a link to get back into your account."
              )}
            </p>
          </div>

          <div className="px-8 pb-9">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {errors.server && <ServerErrorBanner message={errors.server} />}

                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"
                    >
                      <Mail
                        className={`h-4.5 w-4.5 transition-colors duration-150 ${
                          errors.email ? "text-red-400" : "text-gray-400"
                        }`}
                      />
                    </span>

                    <input
                      ref={emailRef}
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={() => {
                        if (
                          email &&
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                        ) {
                        }
                      }}
                      placeholder="name@example.com"
                      disabled={isLoading}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-field-error" : undefined
                      }
                      className={`
                        block w-full rounded-xl border bg-gray-50/70 pl-10 pr-4 py-3
                        text-[0.9375rem] text-gray-900 placeholder-gray-400
                        transition-all duration-150 outline-none
                        focus:bg-white focus:ring-2 focus:ring-offset-0
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          errors.email
                            ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                            : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                        }
                      `}
                    />
                  </div>

                  {errors.email && (
                    <FieldError id="email-field-error" message={errors.email} />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    relative w-full flex items-center justify-center gap-2
                    rounded-xl bg-gray-900 hover:bg-gray-800 active:bg-gray-950
                    text-white text-[0.9375rem] font-semibold
                    py-3 px-5
                    shadow-sm
                    transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2
                    disabled:opacity-60 disabled:cursor-not-allowed
                    active:scale-[0.985]
                  "
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Sending link…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                {errors.server && <ServerErrorBanner message={errors.server} />}

                <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3.5 text-sm text-amber-800 leading-relaxed">
                  <p className="font-semibold mb-0.5">Didn't get the email?</p>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-700">
                    <li>Check your spam or junk folder</li>
                    <li>Make sure the email address is correct</li>
                    <li>Wait up to 2 minutes for delivery</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || isLoading}
                  aria-label={
                    resendCooldown > 0
                      ? `Resend available in ${resendCooldown} seconds`
                      : "Resend reset link"
                  }
                  className="
                    w-full flex items-center justify-center gap-2
                    rounded-xl border border-gray-200 bg-white hover:bg-gray-50
                    text-[0.9375rem] font-semibold text-gray-800
                    py-3 px-5
                    transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    active:scale-[0.985]
                  "
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Resending…
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                      Resend reset link
                      {resendCooldown > 0 && (
                        <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500 tabular-nums">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {resendCooldown}s
                        </span>
                      )}
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link
                    to="/signin"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  >
                    Return to sign in
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[0.8125rem] text-gray-400">
          <ShieldCheck
            className="h-3.5 w-3.5 text-gray-400"
            aria-hidden="true"
          />
          <span>Secure · Encrypted · We never store your password</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
