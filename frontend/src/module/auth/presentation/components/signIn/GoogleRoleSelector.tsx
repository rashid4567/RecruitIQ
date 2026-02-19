"use client";

import { User, Briefcase, GraduationCap, Loader2 } from "lucide-react";
import type { GoogleRoles } from "@/module/auth/domain/constants/google-role";

interface GoogleRoleSelectorProps {
  onRoleSelect: (role: GoogleRoles) => Promise<void>;
  googleLoading: boolean;
}

export function GoogleRoleSelector({ onRoleSelect, googleLoading }: GoogleRoleSelectorProps) {
  return (
    <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <User className="w-5 h-5 text-blue-600" />
        <div>
          <h3 className="font-bold text-gray-900">Complete Your Sign Up</h3>
          <p className="text-sm text-gray-600">
            Tell us how you plan to use CareerConnect
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onRoleSelect("candidate")}
          disabled={googleLoading}
          className="p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
              <GraduationCap className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">Candidate</p>
              <p className="text-xs text-gray-500 mt-2">
                Looking for jobs & career growth
              </p>
            </div>
            {googleLoading && (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            )}
          </div>
        </button>
        <button
          onClick={() => onRoleSelect("recruiter")}
          disabled={googleLoading}
          className="p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-purple-50 rounded-full group-hover:bg-purple-100 transition-colors duration-300">
              <Briefcase className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">Recruiter</p>
              <p className="text-xs text-gray-500 mt-2">
                Hiring talent for companies
              </p>
            </div>
            {googleLoading && (
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}