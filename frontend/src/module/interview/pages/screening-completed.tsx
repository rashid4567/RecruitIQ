import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecruiterInterviewDetails } from "../hooks/recruiter/useRecruiterInterviewDetails";
import { useUpdateInterviewNotes } from "../hooks/recruiter/useUpdateInterviewNotes";
import type { GetRecruiterInterviewDetailsResponse } from "../types/recruiterInterview.types";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/pages/landing/sections/Header";

interface InterviewSummary {
  interviewId: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  title: string;
  round: number;
  mode: string;
  status: string;
  candidateResponseStatus: string;
  candidateRespondedAt: string | null;
  scheduledAt: string | null;
  durationInMinutes: number;
  startedAt: string | null;
  endedAt: string | null;
  recruiterJoinedAt: string | null;
  candidateJoinedAt: string | null;
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

// ---------- formatting utils ----------

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: string | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

function formatDuration(minutes: number) {
  if (!minutes) return "—";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
  return `${hrs} hr${hrs > 1 ? "s" : ""} ${mins} min`;
}

function timeAgo(date: string | null) {
  if (!date) return null;
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

// ---------- data mapping ----------

function mapToSummary(
  interviewId: string,
  res: GetRecruiterInterviewDetailsResponse,
): { summary: InterviewSummary; draftNotes: string } {
  const r = res as any;

  const summary: InterviewSummary = {
    interviewId,
    applicationId: r.applicationId,
    jobId: r.jobId,
    candidateId: r.candidateId,
    candidateName: r.candidateName ?? "Unknown candidate",
    title: r.title ?? "—",
    round: r.round ?? 1,
    mode: r.mode ?? "ONLINE",
    status: r.status ?? "COMPLETED",
    candidateResponseStatus: r.candidateResponseStatus ?? "PENDING",
    candidateRespondedAt: r.candidateRespondedAt ?? null,
    scheduledAt: r.scheduledAt ?? null,
    durationInMinutes: r.durationInMinutes ?? 0,
    startedAt: r.startedAt ?? null,
    endedAt: r.endedAt ?? null,
    recruiterJoinedAt: r.recruiterJoinedAt ?? null,
    candidateJoinedAt: r.candidateJoinedAt ?? null,
  };

  const draftNotes: string = r.notes ?? r.recruiterNotes ?? "";

  return { summary, draftNotes };
}

// ---------- icons ----------

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function AlertIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CalendarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function GlobeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
    </svg>
  );
}

function HourglassIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2h12M6 22h12M6 2c0 5 6 6 6 10s-6 5-6 10M18 2c0 5-6 6-6 10s6 5 6 10" />
    </svg>
  );
}

// ---------- status badges ----------

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
  ONGOING: "bg-amber-50 text-amber-700 border-amber-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  RESCHEDULED: "bg-orange-50 text-orange-700 border-orange-200",
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

const RESPONSE_STYLES: Record<string, { label: string; style: string }> = {
  ACCEPTED: { label: "Accepted Invitation", style: "bg-green-50 text-green-700 border-green-200" },
  PENDING: { label: "Response Pending", style: "bg-gray-50 text-gray-600 border-gray-200" },
  DECLINED: { label: "Declined Invitation", style: "bg-red-50 text-red-700 border-red-200" },
  RESCHEDULE_REQUESTED: { label: "Requested Reschedule", style: "bg-amber-50 text-amber-700 border-amber-200" },
};

function ResponseBadge({ status }: { status: string }) {
  const info = RESPONSE_STYLES[status] ?? { label: status, style: "bg-gray-50 text-gray-600 border-gray-200" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${info.style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {info.label}
    </span>
  );
}

// ---------- summary cards ----------

function SummaryCard({
  icon,
  label,
  value,
  subvalue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subvalue?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-center gap-1.5 text-gray-500 mb-2">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-base font-bold text-gray-950">{value}</p>
      {subvalue && <p className="text-xs text-gray-500 mt-0.5">{subvalue}</p>}
    </div>
  );
}

// ---------- timeline ----------

function InterviewTimeline({ summary }: { summary: InterviewSummary }) {
  const steps = [
    { label: "Scheduled", time: summary.scheduledAt },
    { label: "Recruiter Joined", time: summary.recruiterJoinedAt },
    { label: "Candidate Joined", time: summary.candidateJoinedAt },
    { label: "Interview Started", time: summary.startedAt },
    { label: "Interview Ended", time: summary.endedAt },
  ].filter((s) => s.time);

  if (steps.length === 0) return null;

 
}

// ---------- progress / misc ----------

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
              {step.state === "done" ? <CheckIcon className="w-3.5 h-3.5" /> : i + 1}
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

function ExitWarningModal({ onCancel, onLeave }: { onCancel: () => void; onLeave: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold text-gray-950 mb-2">Unsaved interview notes</h2>
        <p className="text-sm text-gray-600 mb-6">You have unsaved interview notes. Leave anyway?</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button onClick={onLeave} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={"animate-pulse bg-gray-200/80 rounded-md " + className} />;
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-8 pt-6">
        <SkeletonBlock className="h-6 w-64" />
      </div>
      <div className="max-w-7xl mx-auto px-8 py-8 flex gap-8 items-start">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex items-start gap-4">
            <SkeletonBlock className="w-14 h-14 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-6 w-56" />
              <SkeletonBlock className="h-4 w-full max-w-md" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <SkeletonBlock className="h-5 w-40 mb-4" />
            <SkeletonBlock className="h-40 w-full" />
          </div>
        </div>
        <aside className="w-80 shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
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

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-8 py-24 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-5">
          <AlertIcon className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-950 mb-2">Couldn't load this interview</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button onClick={onRetry} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          Try again
        </button>
      </div>
    </div>
  );
}

// ---------- main page ----------

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
        const response = await updateInterviewNotes(interviewId, { notes: value });
        if (!response) throw new Error("Failed to save notes");

        const persistedNotes =
          typeof (response as any)?.notes === "string" ? (response as any).notes : value;

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
    tickTimer.current = setInterval(() => setSavedSecondsAgo((s) => (s === null ? null : s + 1)), 1000);
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
    const prefix = notes.length > 0 && !notes.endsWith("\n\n") ? (notes.endsWith("\n") ? "\n" : "\n\n") : "";
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
      return savedSecondsAgo < 2 ? "Saved just now" : `Saved ${savedSecondsAgo}s ago`;
    }
    return isDirty ? "Unsaved changes" : "No changes yet";
  }, [saveState, savedSecondsAgo, isDirty]);

  if (loading && !summary) return <LoadingState />;
  if (error && !summary) return <ErrorState message={error} onRetry={fetchDetails} />;
  if (!summary) return <LoadingState />;

  const completedAgo = summary.status === "COMPLETED" ? timeAgo(summary.endedAt) : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />

      <div className="max-w-7xl mx-auto px-8 pt-6">
        <ProgressStepper />
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 flex gap-8 items-start">
        <div className="flex-1 min-w-0 space-y-6">
          {/* Hero */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                {initials(summary.candidateName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-950 truncate">{summary.candidateName}</h1>
                  <StatusBadge status={summary.status} />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {summary.title} · Round {summary.round}
                </p>
                {completedAgo && (
                  <p className="text-xs text-gray-400 mt-1">Completed {completedAgo}</p>
                )}
                <div className="mt-3">
                  <ResponseBadge status={summary.candidateResponseStatus} />
                </div>
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <SummaryCard icon={<CalendarIcon />} label="Date" value={formatDate(summary.scheduledAt)} />
            <SummaryCard
              icon={<ClockIcon />}
              label="Time"
              value={formatTime(summary.startedAt ?? summary.scheduledAt)}
              subvalue={summary.endedAt ? `to ${formatTime(summary.endedAt)}` : undefined}
            />
            <SummaryCard icon={<HourglassIcon />} label="Duration" value={formatDuration(summary.durationInMinutes)} />
            <SummaryCard
              icon={<GlobeIcon />}
              label="Mode"
              value={summary.mode.charAt(0) + summary.mode.slice(1).toLowerCase()}
            />
          </div>

          {/* Timeline */}
          <InterviewTimeline summary={summary} />

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-gray-950">Evaluation Notes</h2>
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
                <span className={saveState === "error" ? "text-red-600" : ""}>{savedLabel}</span>
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
            <p className="text-sm text-gray-500 mb-4">Write your observations while they're still fresh.</p>

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
                "Things to consider\n\n• Technical knowledge\n• Communication\n• Confidence\n• Problem solving\n• Overall recommendation"
              }
              rows={14}
              className="w-full resize-y rounded-lg border border-gray-300 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                These notes are private. They will only be visible to recruiters involved in this hiring process.
              </p>
              <span className="text-xs text-gray-400 shrink-0 ml-4">
                {notes.length} / {MAX_CHARS}
              </span>
            </div>
          </div>
        </div>

    
        <aside className="w-80 shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
          <h3 className="text-sm font-bold text-gray-950 uppercase tracking-wide mb-5">Candidate Summary</h3>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {initials(summary.candidateName)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-950 truncate text-sm">{summary.candidateName}</p>
              <p className="text-xs text-gray-500 truncate">{summary.title}</p>
            </div>
          </div>

          <div className="mb-5">
            <StatusBadge status={summary.status} />
          </div>

          <dl className="space-y-4">
            <SidebarRow label="Round" value={`Round ${summary.round}`} />
            <SidebarRow label="Duration" value={formatDuration(summary.durationInMinutes)} />
            <SidebarRow label="Scheduled" value={formatDate(summary.scheduledAt)} />
            <SidebarRow label="Mode" value={summary.mode.charAt(0) + summary.mode.slice(1).toLowerCase()} />
            <SidebarRow
              label="Notes"
              value={
                isDirty && saveState !== "saved" ? (
                  <span className="text-amber-600 font-semibold">Not saved</span>
                ) : (
                  <span className="text-green-700 font-semibold">Saved</span>
                )
              }
            />
          </dl>
        </aside>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <span className={"w-1.5 h-1.5 rounded-full " + (isDirty ? "bg-amber-400" : "bg-green-500")} />
            {isDirty ? "Unsaved changes" : "All changes saved"}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => guardedNavigate(() => navigate(DASHBOARD_ROUTE))}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              ← Dashboard
            </button>
            <button
              disabled={isSaving}
              onClick={async () => {
                if (!interviewId) return;
                if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
                if (isDirty) {
                  const ok = await persist(notes);
                  if (!ok) return;
                }
                if (!summary?.interviewId) return;
                navigate(decisionRoute(summary.interviewId));
              }}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Hiring Decision →
            </button>
          </div>
        </div>
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

function SidebarRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</dt>
      <dd className="text-sm font-bold text-gray-950">{value}</dd>
    </div>
  );
}