"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 bg-white overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }

        @keyframes rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes settle {
          from { opacity: 0; transform: translateY(24px) rotate(var(--rot)) scale(0.96); }
          to { opacity: 1; transform: translateY(0) rotate(var(--rot)) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(var(--rot)); }
          50% { transform: translateY(-6px) rotate(var(--rot)); }
        }
        @keyframes underline-draw {
          from { stroke-dashoffset: 220; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); opacity: .6; }
          50% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes drift {
          0%, 100% { translate: 0 0; }
          50% { translate: 16px -12px; }
        }
        @keyframes ring-pulse {
          0% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.35); }
          100% { box-shadow: 0 0 0 14px rgba(251, 146, 60, 0); }
        }

        .animate-rise { animation: rise 0.6s ease-out both; }
        .card-settle {
          animation: settle 0.7s cubic-bezier(0.22, 1, 0.36, 1) both,
                     float 6s ease-in-out 0.7s infinite;
        }
        .underline-path {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: underline-draw 0.9s cubic-bezier(.2,.7,.2,1) 0.6s forwards;
        }
        .badge-dot-ping {
          animation: badge-pulse 2.4s ease-in-out infinite;
        }
        .hero-orb { animation: drift 12s ease-in-out infinite; }
        .hero-orb-2 { animation-duration: 15s; animation-delay: -5s; }

        .lead-card { animation: ring-pulse 2.6s ease-out 1.4s infinite; }

        .btn-sheen {
          position: relative;
          overflow: hidden;
        }
        .btn-sheen::after {
          content: "";
          position: absolute;
          top: 0;
          left: -60%;
          width: 40%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent);
          transform: skewX(-20deg);
          transition: left 0.6s ease;
        }
        .btn-sheen:hover::after {
          left: 130%;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-rise, .card-settle { animation: none; opacity: 1; }
          .underline-path { animation: none; stroke-dashoffset: 0; }
          .badge-dot-ping { animation: none; }
          .hero-orb { animation: none; }
          .lead-card { animation: none; }
          .btn-sheen::after { transition: none; }
        }
      `}</style>

      {/* ambient background glows, tying the hero to the rest of the page */}
      <div className="hero-orb pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="hero-orb hero-orb-2 pointer-events-none absolute top-1/3 -left-24 w-80 h-80 rounded-full bg-teal-100/40 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-7">
            <div
              className="animate-rise inline-flex items-center gap-2 rounded-full border border-blue-600/15 bg-white px-3.5 py-1.5 shadow-sm"
              style={{ animationDelay: "0ms" }}
            >
              <span className="relative flex w-1.5 h-1.5">
                <span className="badge-dot-ping absolute inline-flex h-full w-full rounded-full bg-blue-400" />
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-blue-600" />
              </span>
              <span className="font-body text-xs font-medium tracking-wide text-gray-900 uppercase">
                AI-powered hiring
              </span>
            </div>

            <h1
              className="animate-rise font-display text-5xl md:text-6xl lg:text-[4.25rem] font-semibold leading-[1.05] tracking-tight text-gray-900"
              style={{ animationDelay: "80ms" }}
            >
              Revolutionize your{" "}
              <span className="relative inline-block">
                recruitment
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="10"
                  viewBox="0 0 200 10"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 6 Q 50 -2 100 6 T 200 6"
                    stroke="#2563EB"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    className="underline-path"
                  />
                </svg>
              </span>{" "}
              with AI.
            </h1>

            <p
              className="animate-rise font-body text-lg text-gray-600 leading-relaxed max-w-lg"
              style={{ animationDelay: "160ms" }}
            >
              RecruitFlow screens, scores, and ranks every applicant against
              the role — so you spend your time interviewing the people
              who actually fit, not sorting resumes.
            </p>

            <div
              className="animate-rise flex flex-col sm:flex-row gap-3 pt-2"
              style={{ animationDelay: "240ms" }}
            >
              <button className="btn-sheen group px-7 py-3.5 bg-blue-600 text-white font-body font-medium rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-all duration-200 shadow-sm shadow-blue-600/20 inline-flex items-center justify-center gap-2">
                Get started
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <button className="px-7 py-3.5 border border-blue-600/25 text-blue-600 font-body font-medium rounded-xl hover:bg-blue-50 hover:border-blue-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-all duration-200 text-center">
                See how it works
              </button>
            </div>
          </div>

          <div className="relative h-105 md:h-120 flex items-center justify-center">
            <div
              className="card-settle absolute w-64 md:w-72 bg-white rounded-[1.75rem] border border-gray-900/8 shadow-sm p-5"
              style={{ ["--rot" as string]: "-9deg", animationDelay: "80ms" }}
            >
              <CandidateCard
                initials="JM"
                name="Jordan Marsh"
                role="Product designer"
                match={71}
                tone="slate"
                delay={500}
                reducedMotion={reducedMotion}
              />
            </div>
            <div
              className="card-settle absolute w-64 md:w-72 bg-white rounded-[1.75rem] border border-gray-900/8 shadow-md p-5"
              style={{ ["--rot" as string]: "6deg", animationDelay: "170ms" }}
            >
              <CandidateCard
                initials="AK"
                name="Ava Kessler"
                role="Backend engineer"
                match={84}
                tone="slate"
                delay={620}
                reducedMotion={reducedMotion}
              />
            </div>
            <div
              className="card-settle lead-card absolute w-64 md:w-72 bg-white rounded-[1.75rem] border-2 border-orange-300 shadow-xl p-5 hover:-translate-y-2 transition-transform duration-300"
              style={{ ["--rot" as string]: "-2deg", animationDelay: "260ms" }}
            >
              <CandidateCard
                initials="RP"
                name="Riya Patel"
                role="Senior frontend engineer"
                match={98}
                tone="amber"
                delay={760}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CandidateCard({
  initials,
  name,
  role,
  match,
  tone,
  delay,
  reducedMotion,
}: {
  initials: string;
  name: string;
  role: string;
  match: number;
  tone: "amber" | "slate";
  delay: number;
  reducedMotion: boolean;
}) {
  const isMatch = tone === "amber";
  const [width, setWidth] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setWidth(match);
      setCount(match);
      return;
    }

    let frame: number;
    const timeout = setTimeout(() => {
      setWidth(match);
      const start = performance.now();
      const duration = 900;

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * match));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [match, delay, reducedMotion]);

  return (
    <div className="font-body">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold ${
            isMatch ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Match score</span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full tabular-nums ${
            isMatch ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          {count}%
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-900 ease-out ${
            isMatch ? "bg-teal-700" : "bg-gray-400"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}