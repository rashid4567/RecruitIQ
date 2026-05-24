import React from "react";
import { Linkedin, Twitter } from "lucide-react";

interface CompanyBannerProps {
  total: number;
}

export const CompanyBanner: React.FC<CompanyBannerProps> = ({ total }) => (
  <div className="relative bg-linear-to-br from-indigo-950 via-indigo-900 to-violet-900 overflow-hidden">
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)",
        backgroundSize: "28px 28px",
      }}
    />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-400/30 to-transparent" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white font-black text-xl shrink-0">
          IT
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              InnovateTech Solutions
            </h1>
            <span className="inline-flex items-center rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-semibold text-indigo-200">
              {total} open roles
            </span>
          </div>
          <p className="text-indigo-300 text-sm mb-4">
            Shaping the Future with Innovation
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Series B",
              "500+ employees",
              "Remote-friendly",
              "📍 Bangalore, India",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-white/8 border border-white/15 px-3 py-1 text-xs font-medium text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:self-start">
          <a
            href="#"
            className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
);