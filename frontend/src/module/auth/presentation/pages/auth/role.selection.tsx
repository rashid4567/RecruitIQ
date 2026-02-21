"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useRoleSelection } from "../../hooks/useRoleSelection";
import { ROLE_SELECTION_CONFIG } from "../../constant/role-selection.config"; 

export default function RoleSelection() {
  const {
    selectedRole,
    selectRole,
    handleContinue,
    goToSignIn,
    isRoleSelected,
  } = useRoleSelection();

  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center px-5 py-8 sm:py-12 overflow-hidden">
      {/* Background decoration – smaller and softer */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-100/15 rounded-full blur-3xl opacity-70" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-100/15 rounded-full blur-3xl opacity-70" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Header – more compact */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-linear-to-r from-slate-900 to-indigo-800 bg-clip-text text-transparent mb-3">
            Choose your path
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Select the role that fits you to get the right experience.
          </p>
        </div>

        {/* Cards – using ROLE_SELECTION_CONFIG */}
        <div className="grid md:grid-cols-2 gap-5 sm:gap-7 mb-10 sm:mb-12">
          {ROLE_SELECTION_CONFIG.map((role) => {
            const isSelected = selectedRole === role.id;
            const Icon = role.icon;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => selectRole(role.id)}
                className={`
                  group relative p-6 sm:p-8 rounded-2xl border transition-all duration-300
                  backdrop-blur-sm bg-white/70 shadow-lg shadow-slate-200/30
                  hover:shadow-xl hover:shadow-blue-200/40 hover:-translate-y-1
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${
                    isSelected
                      ? "border-blue-600 bg-linear-to-br from-blue-50/90 to-indigo-50/70 shadow-blue-300/40 scale-[1.015]"
                      : "border-slate-200/70 hover:border-blue-400/60"
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute -top-2.5 -right-2.5 bg-blue-600 text-white rounded-full p-1 shadow-md">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div
                    className={`
                      mb-6 p-5 rounded-xl transition-all duration-300
                      ${isSelected ? "bg-blue-100/80 scale-105" : "bg-blue-50/70 group-hover:bg-blue-100/80"}
                    `}
                  >
                    <Icon 
                      className={`w-12 h-12 ${role.id === "candidate" ? "text-blue-600" : "text-indigo-600"}`}
                      strokeWidth={1.9}
                    />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                    {role.title}
                  </h3>

                  <p className="text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
                    {role.description}
                  </p>

                  <ul className="space-y-3 w-full text-left text-sm sm:text-base">
                    {role.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-slate-700">
                        <div className="shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                          <svg
                            className="w-3.5 h-3.5 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA section – more compact */}
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <div className="flex justify-between text-sm font-medium text-slate-600 mb-2.5">
              <span>Step 1 / 5</span>
              <span>{isRoleSelected ? "20%" : "0%"}</span>
            </div>
            <div className="h-2 bg-slate-200/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700"
                style={{ width: isRoleSelected ? "20%" : "0%" }}
              />
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!isRoleSelected}
            className={`
              w-full py-3.5 px-6 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300
              flex items-center justify-center gap-2.5 shadow-md
              ${
                isRoleSelected
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-lg active:scale-[0.98]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            Continue
            {isRoleSelected && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <button
              onClick={goToSignIn}
              className="text-blue-700 font-semibold hover:text-blue-800 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}