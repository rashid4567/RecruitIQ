import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSignIn } from "../../hooks/useSignIn";
import { WelcomePanel } from "../../components/signIn/WelcomePanel";
import { SignInForm } from "../../components/signIn/SignInForm";
import { GoogleRoleSelector } from "../../components/signIn/GoogleRoleSelector";
import { AuthAlert } from "../../components/signIn/AuthAlert";
import { ChevronRight, Shield } from "lucide-react";

export default function SignInPage() {
  const {
    signIn,
    handleGoogleResponse,
    handleGoogleRoleSelect,
    error,
    success,
    isLoading,
    googleLoading,
    isAnyLoading,
    showRoleSelector,
    clearMessages,
  } = useSignIn();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-blue-50/50 p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <WelcomePanel isAnyLoading={isAnyLoading} />

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Enter your credentials to access your account
              </p>
            </div>

            <AuthAlert
              error={error}
              success={success}
              onClose={clearMessages}
            />

            {showRoleSelector && (
              <GoogleRoleSelector
                onRoleSelect={handleGoogleRoleSelect}
                googleLoading={googleLoading}
              />
            )}

            <SignInForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={signIn}
              isLoading={isLoading}
              isAnyLoading={isAnyLoading}
              onGoogleResponse={handleGoogleResponse}
              onError={function (error: string): void {
                throw new Error("Function not implemented.");
              }}
            />

            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <p className="text-sm font-semibold text-gray-700">
                  Secure Sign In
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Your credentials are protected with end-to-end encryption and
                never stored in plain text.
              </p>
            </div>

            <div className="text-center pt-8 mt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-6">
                New to CareerConnect?{" "}
                <button
                  onClick={() => navigate("/role-selection")}
                  className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-2 group transition-colors"
                  disabled={isAnyLoading}
                >
                  Create an account
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </p>

              <p className="text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <button className="text-blue-600 hover:underline font-medium">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-blue-600 hover:underline font-medium">
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
