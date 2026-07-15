import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, CheckCircle2, Loader2, Lightbulb, AlertTriangle } from "lucide-react";

interface ResumeProcessingModalProps {

  onCancel: () => void;
}

const STEPS = [
  "Resume uploaded",
  "Extracting information",
  "Matching skills",
  "Building AI profile",
  "Finalizing application",
] as const;

const ROTATING_MESSAGES = [
  "Analyzing resume...",
  "Extracting technical skills...",
  "Understanding your experience...",
  "Comparing with job requirements...",
  "Generating AI profile...",
  "Preparing application...",
  "Almost done...",
] as const;

const TIPS = [
  "Recruiters usually review applications with completed AI analysis much faster.",
  "Adding a LinkedIn profile improves your AI profile accuracy.",
  "Keeping your resume updated helps you receive better recommendations.",
] as const;

const MESSAGE_ROTATE_MS = 3000;
const TIP_ROTATE_MS = 4500;
const LONG_WAIT_THRESHOLD_MS = 30000;

export default function ResumeProcessingModal({ onCancel }: ResumeProcessingModalProps) {
  const [progress, setProgress] = useState(4);
  const [messageIndex, setMessageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showLongWaitNotice, setShowLongWaitNotice] = useState(false);
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

  // Disable ESC while processing.
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-60 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md sm:max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
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

          <div className="px-7 pt-8 pb-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-indigo-100 to-violet-100 flex items-center justify-center animate-[floatBot_2.6s_ease-in-out_infinite]">
              <Bot className="w-8 h-8 text-indigo-600" />
            </div>

            <h2 id="resume-processing-title" className="mt-4 text-lg font-bold text-gray-900">
              AI Resume Analysis
            </h2>
            <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
              We're preparing your application by analyzing your resume and
              matching your skills with this job.
            </p>
          </div>

          <div className="px-7">
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
            <p className="mt-1.5 text-[11px] text-gray-400">
              {showLongWaitNotice
                ? "Still working... large resumes may take slightly longer. Thanks for your patience."
                : "Estimated time remaining: 15\u201330 seconds"}
            </p>
          </div>

          <ul className="px-7 mt-5 space-y-2.5">
            {STEPS.map((step, i) => {
              const done = i < currentStepIndex;
              const active = i === currentStepIndex;
              return (
                <li
                  key={step}
                  className={`flex items-center gap-2.5 text-sm transition-opacity duration-300 ${
                    done || active ? "opacity-100" : "opacity-40"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  ) : active ? (
                    <Loader2 className="w-4.5 h-4.5 text-indigo-500 shrink-0 animate-spin" />
                  ) : (
                    <span className="w-4.5 h-4.5 rounded-full border-2 border-gray-200 shrink-0" />
                  )}
                  <span
                    className={`font-medium ${
                      done
                        ? "text-gray-700"
                        : active
                          ? "text-indigo-700 animate-pulse"
                          : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mx-7 mt-6 flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-100 rounded-2xl">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">{TIPS[tipIndex]}</p>
          </div>

          <div className="mx-7 mt-4 mb-7 flex items-start gap-2 text-[11px] text-gray-400">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-300" />
            <span>
              Please don't close this window until your application is
              submitted. Closing now may interrupt your application process.
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
                Leave Anyway
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
      `}</style>
    </>
  );
}