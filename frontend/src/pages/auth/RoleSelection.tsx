"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserIcon, BriefcaseIcon, ArrowRight } from "lucide-react"
import type { UserRole } from "../../types/auth.types"

const RoleSelection = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const roles = [
    {
      id: "candidate" as UserRole,
      icon: <UserIcon className="w-12 h-12 text-blue-500" />,
      title: "Candidate",
      description: "Looking for your next career opportunity?",
      features: [
        "Personalized Job Matches",
        "Build a Professional Profile",
        "Direct Employer Connections",
        "Resume & Portfolio Showcase",
      ],
    },
    {
      id: "recruiter" as UserRole,
      icon: <BriefcaseIcon className="w-12 h-12 text-blue-500" />,
      title: "Recruiter",
      description: "Find and hire top talent efficiently.",
      features: [
        "Advanced Candidate Sourcing",
        "Applicant Tracking System",
        "Employer Branding Tools",
        "Seamless Hiring Workflows",
      ],
    },
  ]

  const handleContinue = () => {
  if (!selectedRole) return;

  navigate("/signup", {
    state: { role: selectedRole },
  });
};


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center px-4 py-6">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-50/30 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="w-full max-w-3xl">
        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3 animate-fade-in">
            Choose Your Role
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Select the role that best describes you to tailor your RecruitFlow AI experience.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {roles.map((role, idx) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`group relative p-8 rounded-2xl cursor-pointer transition-all duration-500 border-2 overflow-hidden ${
                selectedRole === role.id
                  ? "border-blue-500 bg-linear-to-br from-blue-50 to-blue-100/50 shadow-xl shadow-blue-200/50"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/30"
              }`}
              style={{
                animation: `slideUp 0.6s ease-out ${idx * 0.1}s both`,
              }}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300"></div>

              <div className="relative">
                <div className="mb-6 p-4 bg-linear-to-br from-blue-100 to-blue-50 rounded-xl w-fit group-hover:shadow-lg transition-all duration-300">
                  {role.icon}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">{role.title}</h3>
                <p className="text-slate-600 text-base mb-8 leading-relaxed">{role.description}</p>

                <ul className="space-y-3">
                  {role.features.map((feature, featureIdx) => (
                    <li
                      key={featureIdx}
                      className="flex items-start gap-3 animate-fade-in"
                      style={{ animationDelay: `${0.1 * featureIdx}s` }}
                    >
                      <div className="shrink-0 mt-1">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-linear-to-br from-green-400 to-green-500 text-white">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {selectedRole === role.id && (
                  <div className="mt-6 flex items-center gap-2 text-blue-600 font-semibold">
                    Selected
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-600">Step 1 of 5</span>
            <span className="text-sm font-semibold text-slate-600">20%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500 rounded-full"
              style={{ width: "20%" }}
            ></div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              selectedRole
                ? "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/40"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>

          {/* Login Link */}
          <p className="text-center text-slate-600 mt-6">
            Already have account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default RoleSelection
