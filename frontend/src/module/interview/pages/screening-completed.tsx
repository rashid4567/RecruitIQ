import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecruiterInterviewDetails } from "../hooks/recruiter/useRecruiterInterviewDetails";
import { useUpdateInterviewNotes } from "../hooks/recruiter/useUpdateInterviewNotes";
import type { GetRecruiterInterviewDetailsResponse } from "../types/recruiterInterview.types";
import { useNavigate, useParams } from "react-router-dom";

interface InterviewSummary {
  interviewId: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  position: string;
  round: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  date: string;
}

type SaveState = "idle" | "saving" | "saved" | "error";

const NOTE_TEMPLATES: { label: string; snippet: string }[] = [
  { label: "Technical Skills", snippet: "Technical Skills\n- " },
  { label: "Communication", snippet: "Communication\n- " },
  { label: "Behaviour", snippet: "Behaviour\n- " },
  { label: "Problem Solving", snippet: "Problem Solving\n- " },
  { label: "Culture Fit", snippet: "Culture Fit\n- " },
];

const MAX_CHARS = 5000;
const AUTOSAVE_DELAY_MS = 1500;

const DASHBOARD_ROUTE = "/recruiter/dashboard";
const decisionRoute = (interviewId: string) =>
  `/recruiter/interviews/${interviewId}/hiring-decision`;

function mapToSummary(
  interviewId: string,
  res: GetRecruiterInterviewDetailsResponse,
): { summary: InterviewSummary; draftNotes: string } {
  const r = res as any;

  const summary: InterviewSummary = {
    interviewId,
    applicationId: r.applicationId,
    candidateId: r.candidateId,
    jobId: r.jobId,
    candidateName: r.candidateName ?? r.candidate?.name ?? "Unknown candidate",
    position: r.position ?? r.role ?? r.jobTitle ?? "—",
    round: r.round ?? r.interviewRound ?? "Interview",
    startedAt: r.startedAt ?? r.startTime ?? "—",
    endedAt: r.endedAt ?? r.endTime ?? "—",
    durationMinutes: r.durationMinutes ?? r.duration ?? 0,
    date: r.date ?? r.interviewDate ?? "—",
  };

  const draftNotes: string = r.notes ?? r.recruiterNotes ?? "";

  return { summary, draftNotes };
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function AlertIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function ProgressStepper() {
  const steps = [
    { label: "Interview", state: "done" as const },
    { label: "Notes", state: "current" as const },
    { label: "Decision", state: "upcoming" as const },
  ];

  return (
    <ol className="flex items-center gap-3">
      {steps.map((step, i) => (
        <li key={step.label} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={
                "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 transition-colors " +
                (step.state === "done"
                  ? "bg-blue-600 text-white"
                  : step.state === "current"
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-gray-100 text-gray-400")
              }
            >
              {step.state === "done" ? (
                <CheckIcon className="w-3.5 h-3.5" />
              ) : (
                i + 1
              )}
            </span>
            <span
              className={
                "text-sm font-semibold " +
                (step.state === "upcoming" ? "text-gray-400" : "text-gray-900")
              }
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && <span className="w-10 h-px bg-gray-200" />}
        </li>
      ))}
    </ol>
  );
}

function ExitWarningModal({
  onCancel,
  onLeave,
}: {
  onCancel: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold text-gray-950 mb-2">
          Unsaved interview notes
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          You have unsaved interview notes. Leave anyway?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onLeave}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}

function HeaderBar() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-950">RecruitQ</span>
        </div>
        <nav className="flex items-center gap-10">
          <a
            href="#"
            className="text-gray-700 hover:text-gray-950 font-medium text-sm transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-950 font-medium text-sm transition-colors"
          >
            Applications
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-gray-950 font-medium text-sm transition-colors"
          >
            Settings
          </a>
        </nav>
      </div>
    </header>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={"animate-pulse bg-gray-200/80 rounded-md " + className} />
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />
      <div className="max-w-7xl mx-auto px-8 pt-6">
        <SkeletonBlock className="h-6 w-64" />
      </div>
      <div className="max-w-7xl mx-auto px-8 py-8 flex gap-8 items-start">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex items-start gap-4">
            <SkeletonBlock className="w-11 h-11 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-6 w-56" />
              <SkeletonBlock className="h-4 w-full max-w-md" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <SkeletonBlock className="h-4 w-40 mb-5" />
            <div className="grid grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <SkeletonBlock className="h-3 w-16" />
                  <SkeletonBlock className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <SkeletonBlock className="h-5 w-40 mb-4" />
            <SkeletonBlock className="h-40 w-full" />
          </div>
        </div>
        <aside className="w-80 shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-12 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-4 w-full" />
          ))}
        </aside>
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />
      <div className="max-w-2xl mx-auto px-8 py-24 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-5">
          <AlertIcon className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-950 mb-2">
          Couldn't load this interview
        </h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function InterviewNotesPage() {
  const { interviewId } = useParams<{ interviewId: string }>();

  const navigate = useNavigate();

  const { getDetails, loading, error } = useRecruiterInterviewDetails();
  const { submit: updateInterviewNotes } = useUpdateInterviewNotes();

  const [summary, setSummary] = useState<InterviewSummary | null>(null);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedSecondsAgo, setSavedSecondsAgo] = useState<number | null>(null);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingNavigation = useRef<(() => void) | null>(null);

  const saveStateRef = useRef<SaveState>(saveState);
  useEffect(() => {
    saveStateRef.current = saveState;
  }, [saveState]);

  const isDirty = notes !== savedNotes;

  const fetchDetails = useCallback(async () => {
    if (!interviewId) return;

    const res = await getDetails(interviewId);

    if (res) {
      const { summary: mapped, draftNotes } = mapToSummary(interviewId, res);

      setSummary(mapped);
      setNotes(draftNotes);
      setSavedNotes(draftNotes);
    }
  }, [interviewId, getDetails]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const persist = useCallback(
    async (value: string): Promise<boolean> => {
      if (!interviewId) return false;
      if (saveStateRef.current === "saving") return false;

      setSaveState("saving");
      try {
        const response = await updateInterviewNotes(interviewId, {
          notes: value,
        });

        if (!response) {
          throw new Error("Failed to save notes");
        }
        const persistedNotes =
          typeof (response as any)?.notes === "string"
            ? (response as any).notes
            : value;

        setSavedNotes(persistedNotes);
        setSaveState("saved");
        setSavedSecondsAgo(0);
        return true;
      } catch {
        setSaveState("error");
        return false;
      }
    },
    [interviewId, updateInterviewNotes],
  );

  useEffect(() => {
    if (!isDirty) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => persist(notes), AUTOSAVE_DELAY_MS);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [notes]);
  useEffect(() => {
    if (savedSecondsAgo === null) return;
    if (tickTimer.current) clearInterval(tickTimer.current);
    tickTimer.current = setInterval(
      () => setSavedSecondsAgo((s) => (s === null ? null : s + 1)),
      1000,
    );
    return () => {
      if (tickTimer.current) clearInterval(tickTimer.current);
    };
  }, [savedSecondsAgo]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
        persist(notes);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [notes]);
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const insertTemplate = (snippet: string) => {
    const el = textareaRef.current;
    const prefix =
      notes.length > 0 && !notes.endsWith("\n\n")
        ? notes.endsWith("\n")
          ? "\n"
          : "\n\n"
        : "";
    const next = (notes + prefix + snippet).slice(0, MAX_CHARS);
    setNotes(next);
    requestAnimationFrame(() => el?.focus());
  };

  const guardedNavigate = (action?: () => void) => {
    if (!action) return;
    if (isDirty) {
      pendingNavigation.current = action;
      setShowExitWarning(true);
    } else {
      action();
    }
  };

  const isSaving = saveState === "saving";

  const savedLabel = useMemo(() => {
    if (saveState === "saving") return "Saving…";
    if (saveState === "error") return "Could not save — check your connection";
    if (savedSecondsAgo !== null) {
      return savedSecondsAgo < 2
        ? "Saved just now"
        : `Saved ${savedSecondsAgo}s ago`;
    }
    return isDirty ? "Unsaved changes" : "No changes yet";
  }, [saveState, savedSecondsAgo, isDirty]);

  if (loading && !summary) {
    return <LoadingState />;
  }

  if (error && !summary) {
    return <ErrorState message={error} onRetry={fetchDetails} />;
  }

  if (!summary) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />

      <div className="max-w-7xl mx-auto px-8 pt-6">
        <ProgressStepper />
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 flex gap-8 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 bg-green-50 rounded-full flex items-center justify-center border border-green-200 shrink-0">
              <CheckIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-950">
                Interview Completed
              </h1>
              <p className="text-gray-600 mt-1">
                The interview has ended successfully. Before making a hiring
                decision, record your observations while they're still fresh.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                {initials(summary.candidateName)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-950 truncate">
                  {summary.candidateName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {summary.position} · {summary.round}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 pt-5 border-t border-gray-100">
              <SummaryField label="Interview Date" value={summary.date} />
              <SummaryField
                label="Duration"
                value={`${summary.durationMinutes} minutes`}
              />
              <SummaryField
                label="Interview Status"
                value={
                  <span className="inline-flex items-center gap-1.5 text-green-700 font-semibold">
                    <CheckIcon className="w-3.5 h-3.5" /> Completed
                  </span>
                }
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-gray-950">
                Interview Notes
              </h2>
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <span
                  className={
                    "w-1.5 h-1.5 rounded-full " +
                    (saveState === "saving"
                      ? "bg-amber-400 animate-pulse"
                      : saveState === "error"
                        ? "bg-red-500"
                        : saveState === "saved"
                          ? "bg-green-500"
                          : "bg-gray-300")
                  }
                />
                <span className={saveState === "error" ? "text-red-600" : ""}>
                  {savedLabel}
                </span>
                {saveState === "error" && (
                  <button
                    onClick={() => persist(notes)}
                    className="ml-1 font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                  >
                    Retry
                  </button>
                )}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Write anything that may help during the final evaluation.
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {NOTE_TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => insertTemplate(t.snippet)}
                  disabled={isSaving}
                  className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + {t.label}
                </button>
              ))}
            </div>

            <textarea
              ref={textareaRef}
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, MAX_CHARS))}
              disabled={isSaving}
              placeholder={
                "Example\n\n• Strong React fundamentals\n• Good communication\n• Needed hints during problem solving\n• Could improve Node.js knowledge\n• Calm and confident"
              }
              rows={14}
              className="w-full resize-y rounded-lg border border-gray-300 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                These notes are private. They will only be visible to recruiters
                involved in this hiring process.
              </p>
              <span className="text-xs text-gray-400 shrink-0 ml-4">
                {notes.length} / {MAX_CHARS}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => guardedNavigate(() => navigate(DASHBOARD_ROUTE))}
              className="px-5 py-3 text-sm font-semibold text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <button
                disabled={isSaving}
                onClick={async () => {
                  if (autosaveTimer.current)
                    clearTimeout(autosaveTimer.current);

                  if (isDirty) {
                    const ok = await persist(notes);
                    if (!ok) return;
                  }

                  navigate(DASHBOARD_ROUTE);
                }}
                className="px-5 py-3 text-sm font-semibold text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save &amp; Exit
              </button>
              <button
                disabled={isSaving}
                onClick={async () => {
                  if (!interviewId) return;
                  if (autosaveTimer.current)
                    clearTimeout(autosaveTimer.current);

                  if (isDirty) {
                    const ok = await persist(notes);
                    if (!ok) return;
                  }
                  if (!summary?.interviewId) return;
                  navigate(decisionRoute(summary.interviewId));
                }}
                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Decision →
              </button>
            </div>
          </div>
        </div>

        <aside className="w-80 shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
          <h3 className="text-sm font-bold text-gray-950 uppercase tracking-wide mb-5">
            Interview Status
          </h3>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 mb-6">
            <CheckIcon className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">
              Completed
            </span>
          </div>

          <dl className="space-y-4">
            <SidebarRow label="Candidate" value={summary.candidateName} />
            <SidebarRow label="Position" value={summary.position} />
            <SidebarRow label="Round" value={summary.round} />
            <SidebarRow
              label="Duration"
              value={`${summary.durationMinutes} minutes`}
            />
            <SidebarRow label="Started" value={summary.startedAt} />
            <SidebarRow label="Ended" value={summary.endedAt} />
            <SidebarRow
              label="Notes"
              value={
                isDirty && saveState !== "saved" ? (
                  <span className="text-amber-600 font-semibold">
                    Not saved
                  </span>
                ) : (
                  <span className="text-green-700 font-semibold">Saved</span>
                )
              }
            />
          </dl>
        </aside>
      </div>

      {showExitWarning && (
        <ExitWarningModal
          onCancel={() => {
            setShowExitWarning(false);
            pendingNavigation.current = null;
          }}
          onLeave={() => {
            setShowExitWarning(false);
            const action = pendingNavigation.current;
            pendingNavigation.current = null;
            action?.();
          }}
        />
      )}
    </div>
  );
}

function SummaryField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-bold text-gray-950 mt-1">{value}</p>
    </div>
  );
}

function SidebarRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-sm font-bold text-gray-950">{value}</dd>
    </div>
  );
}
