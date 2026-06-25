import React from "react";
import { Briefcase } from "lucide-react";

export const Header: React.FC = () => (
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black text-slate-900">RecruitIQ</span>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {["Jobs", "Companies", "Applications", "Profile"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
      <a
        href="/dashboard"
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
      >
        Dashboard
      </a>
    </div>
  </header>
);