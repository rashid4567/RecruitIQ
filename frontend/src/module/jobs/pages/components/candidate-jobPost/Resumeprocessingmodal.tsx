import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, CheckCircle2, Loader2, Lightbulb, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";

interface ResumeProcessingModalProps {
  onCancel: () => void;
}

const STEPS = [
  {
    label: "Resume uploaded",
    active: "Uploading your resume...",
    done: "Your resume has been received.",
  },
  {
    label: "Extracting information",
    active: "Reading through your resume...",
    done: "Text and sections extracted.",
  },
  {
    label: "Matching skills",
    active: "Comparing your skills with the job requirements...",
    done: "Skills matched against the role.",
  },
  {
    label: "Building AI profile",
    active: "Generating your candidate profile...",
    done: "Candidate profile generated.",
  },
  {
    label: "Finalizing application",
    active: "Submitting your application...",
    done: "Application finalized.",
  },
] as const;

const ROTATING_MESSAGES = [
  "Understanding your professional experience...",
  "Identifying technical skills...",
  "Matching against job requirements...",
  "Calculating AI compatibility...",
  "Preparing recruiter insights...",
  "Almost finished...",
] as const;

const TIPS = [
  "Recruiters usually review applications with a completed AI analysis much faster.",
  "Adding a LinkedIn profile improves the accuracy of your AI profile.",
  "Keeping your resume up to date helps you get better job recommendations.",
] as const;

const MESSAGE_ROTATE_MS = 3000;
const TIP_ROTATE_MS = 4500;
const LONG_WAIT_THRESHOLD_MS = 20000;

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function ResumeProcessingModal({ onCancel }: ResumeProcessingModalProps) {
  const [progress, setProgress] = useState(5);
  const [messageIndex, setMessageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showLongWaitNotice, setShowLongWaitNotice] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const remaining = 92 - prev;
        const step = Math.max(0.4, remaining * 0.06);
        return Math.min(92, prev + step);
      });
    }, 350);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, MESSAGE_ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, TIP_ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLongWaitNotice(true);
    }, LONG_WAIT_THRESHOLD_MS - (Date.now() - startedAtRef.current));
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startedAtRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setShowLeaveConfirm(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const currentStepIndex = useMemo(() => {
    if (progress < 15) return 0;
    if (progress < 40) return 1;
    if (progress < 65) return 2;
    if (progress < 88) return 3;
    return 4;
  }, [progress]);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-60 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-processing-title"
        >
          <div className="h-1 bg-indigo-100">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="px-8 pt-9 pb-6 text-center">
            <div className="relative w-16 h-16 mx-auto">
              <Sparkles className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-2 w-3 h-3 text-indigo-300 animate-pulse [animation-delay:600ms]" />
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-100 to-violet-100 flex items-center justify-center animate-[floatBot_2.6s_ease-in-out_infinite]">
                <Bot className="w-8 h-8 text-indigo-600" />
              </div>
            </div>

            <h2 id="resume-processing-title" className="mt-4 text-xl font-bold text-gray-900">
              Preparing Your Application
            </h2>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
              Our AI is reviewing your resume and matching it with this job's
              requirements. This helps recruiters review your application
              more effectively.
            </p>
          </div>

          <div className="px-8">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-400">
                {ROTATING_MESSAGES[messageIndex]}
              </span>
              <span className="text-xs font-bold text-indigo-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-indigo-500 via-violet-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-400">
              <span>
                {showLongWaitNotice
                  ? "Still processing \u2014 large resumes can take a little longer."
                  : "Usually takes 8\u201320 seconds"}
              </span>
              <span className="tabular-nums text-gray-400">
                Elapsed {formatElapsed(elapsedMs)}
              </span>
            </div>
          </div>

          <ul className="px-8 mt-5 space-y-2">
            {STEPS.map((step, i) => {
              const done = i < currentStepIndex;
              const active = i === currentStepIndex;
              return (
                <li
                  key={step.label}
                  className={`flex items-start gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors duration-300 ${
                    active ? "bg-indigo-50/70" : ""
                  } ${done || active ? "opacity-100" : "opacity-40"}`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : active ? (
                    <Loader2 className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5 animate-spin" />
                  ) : (
                    <span className="w-4.5 h-4.5 rounded-full border-2 border-gray-200 shrink-0 mt-0.5" />
                  )}
                  <span className="flex flex-col">
                    <span
                      className={`font-medium leading-tight ${
                        done
                          ? "text-gray-700"
                          : active
                            ? "text-indigo-700"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                    {(done || active) && (
                      <span className="text-xs text-gray-400 leading-tight mt-0.5">
                        {active ? step.active : step.done}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mx-8 mt-5 flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-100 rounded-2xl">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-semibold">Did you know?</span>{" "}
              {TIPS[tipIndex]}
            </p>
          </div>

          <div className="mx-8 mt-2.5 flex items-start gap-2.5 px-4 py-2.5 text-[11px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-300" />
            <span>
              Your resume is processed securely and never shared outside this
              application.
            </span>
          </div>

          <div className="mx-8 mt-3 mb-7 flex items-start gap-2 text-[11px] text-gray-400">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-300" />
            <span>
              Keep this window open until your application has been
              submitted. Closing now may interrupt the process.
            </span>
          </div>
        </div>
      </div>

      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/60 z-70 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-11 h-11 mx-auto rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="mt-3 text-base font-bold text-gray-900">
              Leave Application?
            </h3>
            <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
              Your resume is currently being processed. Leaving now may
              interrupt your application.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md"
              >
                Stay Here
              </button>
              <button
                onClick={() => {
                  setShowLeaveConfirm(false);
                  onCancel();
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel Application
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes floatBot {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[floatBot_2\\.6s_ease-in-out_infinite\\],
          .animate-spin,
          .animate-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}