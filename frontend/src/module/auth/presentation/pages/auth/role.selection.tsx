import { useState } from "react";
import {
  UserRound,
  BriefcaseBusiness,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRoleSelection } from "../../hooks/useRoleSelection";
import type { UserRole } from "@/module/auth/domain/constants/user-role";

/* ─────────────────────────────────────────────────────────────────────────────
   Role config
───────────────────────────────────────────────────────────────────────────── */
interface RoleConfig {
  id: UserRole;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tag: string;
  title: string;
  description: string;
  features: string[];
  accent: string;
  selectedBorder: string;
  iconBg: string;
  iconBgSelected: string;
  glowColor: string;
}

const ROLES: RoleConfig[] = [
  {
    id: "candidate",
    icon: UserRound,
    tag: "Job Seeker",
    title: "I'm looking for a job",
    description:
      "Find great opportunities, grow your skills, and connect with top companies.",
    features: [
      "Smart job matching",
      "Easy profile creation",
      "Chat with recruiters",
      "Resume & portfolio tools",
    ],
    accent: "text-blue-600",
    selectedBorder:
      "border-blue-500 bg-gradient-to-b from-blue-50/80 to-indigo-50/60",
    iconBg: "bg-blue-50/80",
    iconBgSelected: "bg-blue-100",
    glowColor: "shadow-blue-300/50",
  },
  {
    id: "recruiter",
    icon: BriefcaseBusiness,
    tag: "Recruiter",
    title: "I'm hiring talent",
    description:
      "Source verified professionals with AI-driven search and a streamlined pipeline.",
    features: [
      "AI candidate search",
      "Powerful filters",
      "Hiring pipeline",
      "Hiring analytics",
    ],
    accent: "text-indigo-600",
    selectedBorder:
      "border-indigo-500 bg-gradient-to-b from-indigo-50/80 to-purple-50/60",
    iconBg: "bg-indigo-50/80",
    iconBgSelected: "bg-indigo-100",
    glowColor: "shadow-indigo-300/50",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */
export default function RoleSelection() {
  const { selectedRole, selectRole, handleContinue, goToSignIn, isRoleSelected } =
    useRoleSelection();

  const [hovered, setHovered] = useState<UserRole | null>(null);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex items-center justify-center px-5 py-10 sm:py-14 overflow-hidden">

      {/* ── Ambient orbs + dot grid ──────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="absolute -bottom-48 left-1/3 w-80 h-80 rounded-full bg-purple-200/15 blur-3xl" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.025]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dots"
              x="0" y="0"
              width="24" height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="#6366f1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-2xl">

        {/* ── Brand ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-300/40">
            <Sparkles className="w-[18px] h-[18px] text-white" strokeWidth={2} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Career<span className="text-blue-600">Connect</span>
          </span>
        </div>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Step 1 of 5 · Getting started
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
            What brings you{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                here today?
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-2 bg-blue-100 rounded-full z-0 opacity-60" />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
            Choose your role to unlock the right experience — you can always change it later.
          </p>
        </div>

        {/* ── Role Cards ───────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isHov = hovered === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => selectRole(role.id)}
                onMouseEnter={() => setHovered(role.id)}
                onMouseLeave={() => setHovered(null)}
                aria-pressed={isSelected}
                className={[
                  "group relative rounded-2xl border-2 p-7 sm:p-8 text-left",
                  "backdrop-blur-sm transition-all duration-300 outline-none",
                  "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  isSelected
                    ? `${role.selectedBorder} shadow-xl ${role.glowColor} scale-[1.02]`
                    : isHov
                    ? "border-slate-300/80 bg-white/80 shadow-lg -translate-y-0.5"
                    : "border-slate-200/70 bg-white/60 shadow-md",
                ].join(" ")}
              >
                {/* ── Selected check badge */}
                <div
                  className={[
                    "absolute -top-3 -right-3 transition-all duration-200",
                    isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75",
                  ].join(" ")}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg ring-2 ring-white">
                    <CheckCircle2 className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
                  </div>
                </div>

                {/* ── Role tag pill */}
                <div
                  className={[
                    "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest",
                    "px-3 py-1 rounded-full mb-5 transition-all duration-200",
                    isSelected
                      ? `bg-white/70 border border-slate-200 ${role.accent}`
                      : "bg-slate-100/80 text-slate-500",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "w-1.5 h-1.5 rounded-full",
                      isSelected ? "bg-current" : "bg-slate-400",
                    ].join(" ")}
                  />
                  {role.tag}
                </div>

                {/* ── Icon */}
                <div
                  className={[
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-5",
                    "transition-all duration-300",
                    isSelected ? role.iconBgSelected : role.iconBg,
                    isSelected || isHov ? "scale-105" : "",
                  ].join(" ")}
                >
                  <Icon className={`w-7 h-7 ${role.accent}`} strokeWidth={1.8} />
                </div>

                {/* ── Text */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  {role.title}
                </h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  {role.description}
                </p>

                {/* ── Feature list */}
                <ul className="space-y-2.5">
                  {role.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <span
                        className={[
                          "shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-200",
                          isSelected ? "bg-green-100" : "bg-slate-100",
                        ].join(" ")}
                      >
                        <svg
                          className={[
                            "w-3 h-3 transition-colors duration-200",
                            isSelected ? "text-green-600" : "text-slate-400",
                          ].join(" ")}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* ── Bottom indicator */}
                <div
                  className={[
                    "mt-7 flex items-center gap-2 text-sm font-semibold transition-all duration-200",
                    isSelected
                      ? `${role.accent} opacity-100`
                      : "text-slate-400 opacity-0 group-hover:opacity-100",
                  ].join(" ")}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Selected
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Select this role
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Progress + CTA ───────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Profile completion</span>
              <span
                className={`transition-colors duration-300 ${
                  isRoleSelected ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {isRoleSelected ? "20%" : "0%"} / 100%
              </span>
            </div>
            <div className="h-2 bg-slate-200/70 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: isRoleSelected ? "20%" : "0%" }}
              />
            </div>
            <div className="flex gap-1.5 mt-2.5">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={[
                    "flex-1 h-1 rounded-full transition-all duration-500",
                    step === 1 && isRoleSelected ? "bg-blue-500" : "bg-slate-200",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!isRoleSelected}
            className={[
              "w-full py-4 px-6 rounded-xl font-bold text-base sm:text-lg",
              "flex items-center justify-center gap-2.5 transition-all duration-300",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
              isRoleSelected
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-300/40 hover:shadow-xl hover:shadow-blue-400/40 hover:-translate-y-0.5 active:scale-[0.99]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none",
            ].join(" ")}
          >
            {isRoleSelected ? (
              <>
                Continue to Sign Up
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              "Select a role to continue"
            )}
          </button>

          {/* Sign in */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={goToSignIn}
              className="text-blue-700 font-semibold hover:text-blue-800 transition-colors underline underline-offset-2"
            >
              Sign in
            </button>
          </p>

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-6 pt-2 flex-wrap">
            {[
              { icon: ShieldCheck, label: "Secure & encrypted" },
              { icon: CheckCircle2, label: "GDPR compliant" },
              { icon: Sparkles, label: "Free to join" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs text-slate-400"
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}