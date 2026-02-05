"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { forgotPasswordUc } from "../../di/auth";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await forgotPasswordUc.execute(email);

      setIsSubmitted(true);
      toast.success("Reset link sent successfully!", {
        description: "Check your email inbox for further instructions.",
        duration: 5000,
      });
    } catch (err: any) {
      toast.error("Failed to send reset link", {
        description: err.message || "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) setErrors({});
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/signin"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Sign In</span>
            </Link>
            <div className="text-sm text-gray-500">Step 1 of 2</div>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {isSubmitted ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <Mail className="h-8 w-8 text-blue-500" />
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isSubmitted ? "Check Your Email" : "Forgot Password"}
            </h1>

            <p className="text-gray-600">
              {isSubmitted
                ? `We've sent instructions to ${email}`
                : "Enter your email address to receive a reset link."}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          ) : (
            <button
              onClick={() => handleSubmit()}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4"
            >
              {loading ? "Resending..." : "Resend Link"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
