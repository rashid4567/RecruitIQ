"use client";

import { useEffect, useRef, useState } from "react";
import { FileSearch, Gauge, CalendarCheck2, type LucideIcon } from "lucide-react";

const accentStyles = {
  blue: {
    bg: "bg-blue-50",
    ring: "ring-blue-100",
    icon: "text-blue-600",
    dot: "bg-blue-600",
    line: "#3B82F6",
  },
  teal: {
    bg: "bg-teal-50",
    ring: "ring-teal-100",
    icon: "text-teal-700",
    dot: "bg-teal-700",
    line: "#0F766E",
  },
  orange: {
    bg: "bg-orange-50",
    ring: "ring-orange-100",
    icon: "text-orange-500",
    dot: "bg-orange-400",
    line: "#F97316",
  },
};

type Accent = keyof typeof accentStyles;

interface Step {
  icon: LucideIcon;
  label: string;
  detail: string;
  accent: Accent;
}

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Trigger the reveal sequence only once, when the panel actually
  // scrolls into view — animating things nobody has scrolled to yet
  // just wastes the motion.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    if (mq.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }

        /* staggered reveal for text + step cards */
        .cta3-item {
          opacity: 0;
          transform: translateY(18px);
          filter: blur(4px);
          transition: opacity .7s cubic-bezier(.2,.7,.2,1),
                      transform .7s cubic-bezier(.2,.7,.2,1),
                      filter .7s ease;
        }
        .cta3-item-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        /* connecting line draws left to right once in view */
        .cta3-flow-line {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
        }
        .cta3-flow-line-visible {
          stroke-dasharray: 220;
          stroke-dashoffset: 0;
          transition: stroke-dashoffset 1.1s ease-out .5s;
        }

        /* step-number badges pop in with a little overshoot */
        .cta3-badge-pop {
          opacity: 0;
          transform: scale(0.4);
          transition: opacity .4s cubic-bezier(.34,1.56,.64,1),
                      transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .cta3-badge-pop-visible {
          opacity: 1;
          transform: scale(1);
        }

        /* hover interaction on each step */
        .cta3-step-card {
          transition: transform .25s cubic-bezier(.2,.7,.2,1);
        }
        .cta3-step-card:hover {
          transform: translateY(-3px);
        }
        .cta3-step-icon {
          transition: transform .25s cubic-bezier(.34,1.4,.64,1);
        }
        .cta3-step-card:hover .cta3-step-icon {
          transform: scale(1.08) rotate(-2deg);
        }

        /* slow ambient drift on the background glows, independent of
           the Tailwind transform utilities already centering them */
        @keyframes cta3-drift {
          0%, 100% { translate: 0 0; }
          50% { translate: 14px -10px; }
        }
        .cta3-orb {
          animation: cta3-drift 11s ease-in-out infinite;
        }
        .cta3-orb-2 { animation-duration: 13s; animation-delay: -4s; }
        .cta3-orb-3 { animation-duration: 15s; animation-delay: -7s; }

        @media (prefers-reduced-motion: reduce) {
          .cta3-item, .cta3-badge-pop {
            transition: none;
            opacity: 1;
            transform: none;
            filter: none;
          }
          .cta3-flow-line-visible {
            transition: none;
            stroke-dashoffset: 0;
          }
          .cta3-step-card, .cta3-step-icon {
            transition: none;
          }
          .cta3-orb {
            animation: none;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] border border-gray-200 bg-linear-to-b from-blue-50/50 to-white px-6 sm:px-12 py-14 md:py-16 overflow-hidden">
          {/* soft corner accents, gently drifting */}
          <div className="cta3-orb cta3-orb-1 pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="cta3-orb cta3-orb-2 pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-teal-100/50 blur-3xl" />
          <div className="cta3-orb cta3-orb-3 pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-orange-50/40 blur-3xl" />

          <div className="relative text-center max-w-2xl mx-auto mb-14 space-y-4">
            <h2
              className={`cta3-item ${isVisible ? "cta3-item-visible" : ""} font-display text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-[1.1]`}
              style={{ transitionDelay: "0ms" }}
            >
              Resume in. Interview booked.
            </h2>
            <p
              className={`cta3-item ${isVisible ? "cta3-item-visible" : ""} font-body text-lg text-gray-600 leading-relaxed`}
              style={{ transitionDelay: "120ms" }}
            >
              RecruitFlow reads, ranks, and books every strong applicant —
              automatically.
            </p>
          </div>

          {/* process strip */}
          <div className="relative mb-14">
            <svg
              className="hidden md:block absolute top-8 left-0 w-full h-6 -translate-y-1/2"
              viewBox="0 0 600 24"
              preserveAspectRatio="none"
            >
              <line x1="96" y1="12" x2="504" y2="12" stroke="#E2E8F0" strokeWidth="1.5" />
              <line
                x1="96" y1="12" x2="504" y2="12"
                stroke="#CBD5E1" strokeWidth="1.5"
                className={isVisible ? "cta3-flow-line-visible" : "cta3-flow-line"}
              />
              {isVisible && !reducedMotion && (
                <circle r="4" fill="#94A3B8" opacity="0">
                  <animate attributeName="opacity" from="0" to="1" begin="1.4s" dur=".3s" fill="freeze" />
                  <animateMotion
                    dur="2.6s"
                    begin="1.4s"
                    repeatCount="indefinite"
                    path="M96,12 L504,12"
                  />
                </circle>
              )}
            </svg>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const style = accentStyles[step.accent];
                return (
                  <div
                    key={step.label}
                    className={`cta3-step-card cta3-item ${isVisible ? "cta3-item-visible" : ""} flex flex-col items-center text-center rounded-2xl px-4 py-5 -mx-4 -my-5`}
                    style={{ transitionDelay: `${240 + i * 110}ms` }}
                  >
                    <div className="relative mb-4">
                      <div
                        className={`cta3-step-icon w-16 h-16 rounded-2xl flex items-center justify-center border border-white shadow-sm ring-4 ${style.bg} ${style.ring}`}
                      >
                        <Icon className={`w-7 h-7 ${style.icon}`} strokeWidth={1.8} />
                      </div>
                      <span
                        className={`cta3-badge-pop ${isVisible ? "cta3-badge-pop-visible" : ""} absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-sm ${style.dot}`}
                        style={{ transitionDelay: `${460 + i * 110}ms` }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <p className="font-display text-base font-semibold text-gray-900 mb-1">
                      {step.label}
                    </p>
                    <p className="font-body text-sm text-gray-500 max-w-52 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <p
            className={`cta3-item ${isVisible ? "cta3-item-visible" : ""} font-body text-sm text-gray-500 text-center mt-2`}
            style={{ transitionDelay: "620ms" }}
          >
            No credit card required · set up your first job in 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
}