

import { useState, useRef, useEffect } from "react";
import {
  FileSearch,
  Gauge,
  CalendarCheck2,
  Briefcase,
  UserRound,
  ChevronDown,
} from "lucide-react";

const accentStyles = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", dot: "bg-blue-600" },
  teal: { bg: "bg-teal-50", icon: "text-teal-700", dot: "bg-teal-700" },
  orange: { bg: "bg-orange-50", icon: "text-orange-500", dot: "bg-orange-400" },
};

type Accent = keyof typeof accentStyles;

type Step = {
  icon: typeof FileSearch;
  label: string;
  detail: string;
  accent: Accent;
};

const steps: Step[] = [
  {
    icon: FileSearch,
    label: "AI resume analysis",
    detail: "Parses every application in seconds",
    accent: "blue",
  },
  {
    icon: Gauge,
    label: "Smart scoring",
    detail: "Ranks candidates against the role",
    accent: "teal",
  },
  {
    icon: CalendarCheck2,
    label: "Interview scheduling",
    detail: "Books top matches automatically",
    accent: "orange",
  },
];

export default function CTA() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function goTo(path: string) {
    setOpen(false);
    window.location.href = path;
  }

  return (
    <section className="py-20 md:py-28 bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }

        @keyframes cta3-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cta3-flow {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes cta3-menu {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cta3-rise { animation: cta3-rise 0.6s ease-out both; }
        .cta3-flow-line { stroke-dasharray: 6 6; animation: cta3-flow 1.2s linear infinite; }
        .cta3-menu { animation: cta3-menu 0.16s ease-out both; transform-origin: top; }

        @media (prefers-reduced-motion: reduce) {
          .cta3-rise, .cta3-menu { animation: none; opacity: 1; }
          .cta3-flow-line { animation: none; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] border border-gray-200 bg-linear-to-b from-blue-50/50 to-white px-6 sm:px-12 py-14 md:py-16 overflow-hidden">
          {/* soft corner accent */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-teal-100/50 blur-3xl" />

          <div className="relative text-center max-w-2xl mx-auto mb-12 space-y-4">
            <div
              className="cta3-rise inline-flex items-center gap-2 rounded-full border border-blue-600/15 bg-white px-3.5 py-1.5"
              style={{ animationDelay: "0ms" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="font-body text-xs font-semibold tracking-wide text-blue-600 uppercase">
                From application to interview
              </span>
            </div>
            <h2
              className="cta3-rise font-display text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight"
              style={{ animationDelay: "70ms" }}
            >
              Resume in. Interview booked.
            </h2>
            <p
              className="cta3-rise font-body text-lg text-gray-600"
              style={{ animationDelay: "130ms" }}
            >
              RecruitFlow reads, ranks, and books every strong applicant —
              automatically.
            </p>
          </div>

          {/* process strip */}
          <div className="relative mb-12">
            <svg
              className="hidden md:block absolute top-8 left-0 w-full h-px"
              viewBox="0 0 100 1"
              preserveAspectRatio="none"
            >
              <line
                x1="16" y1="0.5" x2="84" y2="0.5"
                stroke="#CBD5E1" strokeWidth="1"
                className="cta3-flow-line"
              />
            </svg>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const style = accentStyles[step.accent];
                return (
                  <div
                    key={step.label}
                    className="cta3-rise flex flex-col items-center text-center"
                    style={{ animationDelay: `${190 + i * 70}ms` }}
                  >
                    <div className="relative mb-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white shadow-sm ${style.bg}`}
                      >
                        <Icon className={`w-7 h-7 ${style.icon}`} strokeWidth={1.8} />
                      </div>
                      <span
                        className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center ${style.dot}`}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <p className="font-display text-base font-semibold text-gray-900 mb-1">
                      {step.label}
                    </p>
                    <p className="font-body text-sm text-gray-500 max-w-52">
                      {step.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA actions */}
          <div
            className="cta3-rise flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{ animationDelay: "420ms" }}
          >
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={open}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 text-white font-body font-medium rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              >
                Get started free
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && (
                <div className="cta3-menu absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-20">
                  <button
                    onClick={() => goTo("/recruiter/dashboard")}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors duration-150 text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Briefcase className="w-4.5 h-4.5 text-blue-600" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-gray-900">I'm hiring</p>
                      <p className="font-body text-xs text-gray-500">Post roles & review matches</p>
                    </div>
                  </button>
                  <div className="h-px bg-gray-100" />
                  <button
                    onClick={() => goTo("/candidate/jobs")}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-teal-50 transition-colors duration-150 text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                      <UserRound className="w-4.5 h-4.5 text-teal-700" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-gray-900">I'm job hunting</p>
                      <p className="font-body text-xs text-gray-500">Browse your best-fit roles</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button className="w-full sm:w-auto px-7 py-3.5 border border-blue-600/25 text-blue-600 font-body font-medium rounded-xl hover:bg-blue-50 hover:border-blue-600/40 transition-all duration-200">
              See how it works
            </button>
          </div>
          <p
            className="cta3-rise font-body text-xs text-gray-500 text-center mt-4"
            style={{ animationDelay: "480ms" }}
          >
            No credit card required · set up your first job in 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
}