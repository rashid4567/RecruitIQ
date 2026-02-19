"use client";

import { useNavigate } from "react-router-dom";
import { Key, Briefcase, GraduationCap, ArrowRight } from "lucide-react";

interface WelcomePanelProps {
  isAnyLoading: boolean;
}

export function WelcomePanel({ isAnyLoading }: WelcomePanelProps) {
  const navigate = useNavigate();

  return (
    <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/50 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white/50 blur-xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <Key className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">RecruitIQ</h1>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Welcome Back to Your
              <br />
              <span className="text-blue-200">Career Journey</span>
            </h2>
            <p className="text-blue-100/90 text-lg leading-relaxed">
              Sign in to access personalized job matches, career insights,
              and professional networking opportunities.
            </p>
          </div>

          <div className="space-y-6 mt-10">
            <div className="flex items-center gap-5 p-4 bg-white/10 rounded-xl backdrop-blur-sm transition-all hover:scale-105">
              <div className="p-3 bg-white/20 rounded-full">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Job Seekers</h3>
                <p className="text-sm text-blue-100/80 mt-1">
                  AI-powered job matching & career guidance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 p-4 bg-white/10 rounded-xl backdrop-blur-sm transition-all hover:scale-105">
              <div className="p-3 bg-white/20 rounded-full">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Recruiters</h3>
                <p className="text-sm text-blue-100/80 mt-1">
                  Smart candidate matching & hiring tools
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 pt-8 border-t border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-100/80">Don't have an account?</p>
            <p className="text-blue-200 font-semibold mt-1">
              Join 50,000+ professionals
            </p>
          </div>
          <button
            onClick={() => navigate("/role-selection")}
            disabled={isAnyLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Sign Up Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}