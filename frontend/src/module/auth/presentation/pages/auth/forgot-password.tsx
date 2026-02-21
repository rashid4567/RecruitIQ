import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { forgotPasswordUc } from "../../di/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      toast.error(emailError);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await forgotPasswordUc.execute(email.trim());

      setIsSubmitted(true);
      toast.success("Reset link sent", {
        description: "Check your inbox (and spam folder) for the reset instructions.",
        duration: 6000,
      });
    } catch (err: any) {
      const msg = err.message || "Something went wrong. Please try again.";
      toast.error("Couldn't send reset link", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
          {/* Header / Back + Step */}
          <div className="px-8 pt-8 pb-4 flex items-center justify-between">
            <Link
              to="/signin"
              className="group flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
              Back to Sign in
            </Link>
            <span className="text-xs font-medium text-gray-500">Step 1 of 2</span>
          </div>

          {/* Illustration / Icon area */}
          <div className="px-8 pb-6 text-center">
            <div
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                isSubmitted
                  ? "bg-green-100 text-green-600 shadow-green-100/50"
                  : "bg-blue-100 text-blue-600 shadow-blue-100/50"
              }`}
            >
              {isSubmitted ? (
                <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} />
              ) : (
                <Mail className="h-10 w-10" strokeWidth={2.2} />
              )}
            </div>

            <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {isSubmitted ? "Check your inbox" : "Forgot your password?"}
            </h1>

            <p className="mt-3 text-gray-600 leading-relaxed">
              {isSubmitted ? (
                <>
                  We sent password reset instructions to{" "}
                  <span className="font-medium text-gray-900 break-all">{email}</span>
                </>
              ) : (
                "Enter your email and we'll send you a link to reset your password."
              )}
            </p>
          </div>

          {/* Form or Success state */}
          <div className="px-8 pb-10">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="name@example.com"
                      className={`
                        block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 
                        rounded-xl text-gray-900 placeholder-gray-400 
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        focus:bg-white transition-all duration-200
                        disabled:opacity-60 disabled:cursor-not-allowed
                        ${errors.email ? "border-red-400 focus:ring-red-500 focus:border-red-500" : ""}
                      `}
                      disabled={loading}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                  </div>

                  {errors.email && (
                    <div className="mt-2 flex items-center text-sm text-red-600" id="email-error">
                      <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      {errors.email}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full flex items-center justify-center gap-2 py-3.5 px-4 
                    bg-gradient-to-r from-blue-600 to-blue-700 
                    hover:from-blue-700 hover:to-blue-800 
                    text-white font-medium rounded-xl shadow-lg shadow-blue-200/30 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                    transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                    active:scale-[0.98]
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center text-sm text-gray-600">
                  Didn't receive the email? Check your spam folder or try resending.
                </div>

                <button
                  onClick={() => handleSubmit()}
                  disabled={loading}
                  className={`
                    w-full flex items-center justify-center gap-2 py-3.5 px-4 
                    bg-gradient-to-r from-blue-600 to-blue-700 
                    hover:from-blue-700 hover:to-blue-800 
                    text-white font-medium rounded-xl shadow-lg shadow-blue-200/30 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                    transition-all duration-200 disabled:opacity-60
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend Reset Link"
                  )}
                </button>

                <div className="text-center">
                  <Link
                    to="/signin"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    Return to Sign in
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Optional subtle footer hint */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Secure • Encrypted • We never store your password
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;