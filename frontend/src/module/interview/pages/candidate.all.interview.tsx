import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ListTodo,
  Clock,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  Loader2,
  Video,
  MapPin,
  ExternalLink,
  Search,
  X,
  CalendarClock,
  CheckCircle2,
  RefreshCw,
  Hourglass,
  Sparkles,
} from "lucide-react";
import { useCandidateInterviews } from "../hooks/candidate/useCandidateInterviews";
import { useJoinInterview } from "../hooks/candidate/useJoinInterview";
import type { GetCandidateInterviewsResponse } from "../types/candidateInterview.types";
import {
  InterviewMode,
  InterviewStatus,
  CandidateResponseStatus,
} from "../types/interview.types";
import Sidebar from "../../candidate/pages/components/personalInfo/shared/candidateSidebar";
import Header from "@/pages/landing/sections/Header";
import InterviewDecisionModal from "./components/interview-decision-modal";
import RequestRescheduleModal from "./components/request-reschedule-modal";

type ViewMode = "timeline" | "calendar" | "list";
type StatusFilter = "ALL" | InterviewStatus;
type ModeFilter = "ALL" | InterviewMode;

interface ExpandedState {
  [key: string]: boolean;
}

interface DecisionModalState {
  open: boolean;
  interview?: GetCandidateInterviewsResponse;
}

interface RescheduleModalState {
  open: boolean;
  interview?: GetCandidateInterviewsResponse;
}

const ITEMS_PER_PAGE = 6;
const PAGE_WINDOW = 1;

function normalizeToArray(result: unknown): GetCandidateInterviewsResponse[] {
  if (Array.isArray(result)) return result;
  if (result && typeof result === "object") {
    const maybe = result as {
      data?: unknown;
      items?: unknown;
      results?: unknown;
    };
    if (Array.isArray(maybe.data))
      return maybe.data as GetCandidateInterviewsResponse[];
    if (Array.isArray(maybe.items))
      return maybe.items as GetCandidateInterviewsResponse[];
    if (Array.isArray(maybe.results))
      return maybe.results as GetCandidateInterviewsResponse[];
  }
  return [];
}

function inferMode(interview: GetCandidateInterviewsResponse): InterviewMode {
  if (interview.meetingLink) return InterviewMode.ONLINE;
  if (interview.location) return InterviewMode.OFFLINE;
  return InterviewMode.ONLINE;
}

function isScheduledInterview(
  interview: GetCandidateInterviewsResponse,
): boolean {
  return Boolean(interview.id && interview.scheduledAt);
}

function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatMonthLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatDayNumber(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric" });
}

function formatWeekday(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRelative(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const minutes = Math.round(abs / 60000);
  const hours = Math.round(abs / 3600000);
  const days = Math.round(abs / 86400000);

  let label: string;
  if (minutes < 60) label = `${Math.max(minutes, 1)}m`;
  else if (hours < 24) label = `${hours}h`;
  else label = `${days}d`;

  return diffMs >= 0 ? `in ${label}` : `${label} ago`;
}

const ACTIVE_STATUSES: string[] = [
  InterviewStatus.SCHEDULED,
  InterviewStatus.RESCHEDULED,
  InterviewStatus.ONGOING,
];
const TERMINAL_STATUSES: string[] = [
  InterviewStatus.COMPLETED,
  InterviewStatus.CANCELLED,
  InterviewStatus.NO_SHOW,
];

function isUpcoming(interview: GetCandidateInterviewsResponse): boolean {
  if (!isScheduledInterview(interview) || !interview.scheduledAt) return false;
  if (interview.status === InterviewStatus.ONGOING) return true;
  if (!ACTIVE_STATUSES.includes(interview.status ?? "")) return false;
  return new Date(interview.scheduledAt).getTime() > Date.now();
}

function isPast(interview: GetCandidateInterviewsResponse): boolean {
  if (!isScheduledInterview(interview) || !interview.scheduledAt) return false;
  if (TERMINAL_STATUSES.includes(interview.status ?? "")) return true;
  return new Date(interview.scheduledAt).getTime() <= Date.now();
}

// A candidate can still ask for a new time as long as the interview hasn't
// moved past SCHEDULED/RESCHEDULED (no point rescheduling something ongoing
// or already resolved), and there isn't already a request in flight.
function canRequestReschedule(
  interview: GetCandidateInterviewsResponse,
): boolean {
  if (!isUpcoming(interview)) return false;
  if (interview.rescheduleRequested) return false;
  const modifiableStatuses: string[] = [
    InterviewStatus.SCHEDULED,
    InterviewStatus.RESCHEDULED,
  ];
  return modifiableStatuses.includes(interview.status ?? "");
}

function needsResponse(interview: GetCandidateInterviewsResponse): boolean {
  return (
    isUpcoming(interview) &&
    interview.candidateResponseStatus === CandidateResponseStatus.PENDING
  );
}

const JOINABLE_WINDOW_MS = 15 * 60 * 1000;

function canJoinNow(interview: GetCandidateInterviewsResponse): boolean {
  if (!interview.scheduledAt || !interview.meetingLink) return false;
  if (inferMode(interview) !== InterviewMode.ONLINE) return false;
  if (interview.status === InterviewStatus.ONGOING) return true;
  if (!ACTIVE_STATUSES.includes(interview.status ?? "")) return false;
  const start = new Date(interview.scheduledAt).getTime();
  const duration = (interview.durationInMinutes ?? 60) * 60 * 1000;
  const now = Date.now();
  return now >= start - JOINABLE_WINDOW_MS && now <= start + duration;
}

interface StatusConfig {
  label: string;
  pill: string;
  dot: string;
  bar: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  [InterviewStatus.SCHEDULED]: {
    label: "Scheduled",
    pill: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
  },
  [InterviewStatus.RESCHEDULED]: {
    label: "Rescheduled",
    pill: "bg-violet-50 text-violet-700 border border-violet-200",
    dot: "bg-violet-500",
    bar: "bg-violet-500",
  },
  [InterviewStatus.ONGOING]: {
    label: "Live now",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  [InterviewStatus.COMPLETED]: {
    label: "Completed",
    pill: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
    bar: "bg-slate-400",
  },
  [InterviewStatus.CANCELLED]: {
    label: "Cancelled",
    pill: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    bar: "bg-red-500",
  },
  [InterviewStatus.NO_SHOW]: {
    label: "No Show",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
};

const DEFAULT_STATUS_CONFIG: StatusConfig = {
  label: "Pending",
  pill: "bg-slate-50 text-slate-500 border border-slate-200",
  dot: "bg-slate-300",
  bar: "bg-slate-300",
};

function getStatusConfig(
  interview: GetCandidateInterviewsResponse,
): StatusConfig {
  return STATUS_CONFIG[interview.status ?? ""] ?? DEFAULT_STATUS_CONFIG;
}

// Candidate's own response to the invite — surfaced separately from the
// interview's lifecycle status above.
const RESPONSE_CONFIG: Record<string, StatusConfig> = {
  [CandidateResponseStatus.PENDING]: {
    label: "Awaiting your response",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
  [CandidateResponseStatus.ACCEPTED]: {
    label: "You accepted",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  [CandidateResponseStatus.DECLINED]: {
    label: "You declined",
    pill: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    bar: "bg-red-500",
  },
};

function getResponseConfig(
  interview: GetCandidateInterviewsResponse,
): StatusConfig | null {
  return RESPONSE_CONFIG[interview.candidateResponseStatus ?? ""] ?? null;
}

function groupByDate(
  interviews: GetCandidateInterviewsResponse[],
): Record<string, GetCandidateInterviewsResponse[]> {
  const groups: Record<string, GetCandidateInterviewsResponse[]> = {};
  for (const interview of interviews) {
    if (!interview.scheduledAt) continue;
    const label = formatDateLabel(interview.scheduledAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(interview);
  }
  return groups;
}

function groupByMonth(
  interviews: GetCandidateInterviewsResponse[],
): Record<string, GetCandidateInterviewsResponse[]> {
  const groups: Record<string, GetCandidateInterviewsResponse[]> = {};
  for (const interview of interviews) {
    if (!interview.scheduledAt) continue;
    const label = formatMonthLabel(interview.scheduledAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(interview);
  }
  return groups;
}

function matchesFilters(
  interview: GetCandidateInterviewsResponse,
  search: string,
  status: StatusFilter,
  mode: ModeFilter,
): boolean {
  if (status !== "ALL" && interview.status !== status) return false;
  if (mode !== "ALL" && inferMode(interview) !== mode) return false;
  if (search.trim()) {
    const needle = search.trim().toLowerCase();
    const haystack = `${interview.title ?? ""}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

function buildPageSequence(
  current: number,
  total: number,
  window: number,
): (number | "ellipsis")[] {
  if (total <= 1) return [1];
  const pages = new Set<number>([1, total, current]);
  for (let i = 1; i <= window; i++) {
    if (current - i >= 1) pages.add(current - i);
    if (current + i <= total) pages.add(current + i);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(sorted[i]);
  }
  return result;
}

export default function MyInterviews() {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [expandedDates, setExpandedDates] = useState<ExpandedState>({});
  const [interviews, setInterviews] = useState<
    GetCandidateInterviewsResponse[]
  >([]);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [decisionModal, setDecisionModal] = useState<DecisionModalState>({
    open: false,
  });
  const [rescheduleModal, setRescheduleModal] = useState<RescheduleModalState>({
    open: false,
  });

  const { getInterviews, loading, error } = useCandidateInterviews();
  const {
    submit: submitJoin,
    error: joinError,
    setError: setJoinError,
  } = useJoinInterview();

  async function loadInterviews() {
    const result = await getInterviews();
    setInterviews(normalizeToArray(result));
  }

  useEffect(() => {
    loadInterviews();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, modeFilter, viewMode]);

  const toggleDate = (date: string) => {
    setExpandedDates((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const goToInterview = (interview: GetCandidateInterviewsResponse) => {
    if (!interview.id) return;
    navigate(`/candidate/interview/${interview.id}`);
  };

  // ── reschedule / accept / decline actions ──────────────────────────────

  function openDecision(
    e: React.MouseEvent,
    interview: GetCandidateInterviewsResponse,
  ) {
    e.stopPropagation();
    setDecisionModal({ open: true, interview });
  }

  function closeDecisionModal() {
    setDecisionModal({ open: false });
  }

  function handleAccepted(interviewId: string) {
    setInterviews((prev) =>
      prev.map((i) =>
        i.id === interviewId
          ? { ...i, candidateResponseStatus: CandidateResponseStatus.ACCEPTED }
          : i,
      ),
    );
    setDecisionModal({ open: false });
    loadInterviews();
  }

  function handleRejected(interviewId: string) {
    setInterviews((prev) =>
      prev.map((i) =>
        i.id === interviewId
          ? { ...i, candidateResponseStatus: CandidateResponseStatus.DECLINED }
          : i,
      ),
    );
    setDecisionModal({ open: false });
    loadInterviews();
  }

  function openRescheduleRequest(
    e: React.MouseEvent,
    interview: GetCandidateInterviewsResponse,
  ) {
    e.stopPropagation();
    setRescheduleModal({ open: true, interview });
  }

  function closeRescheduleModal() {
    setRescheduleModal({ open: false });
  }

  function handleRescheduleRequested(interviewId: string) {
    setInterviews((prev) =>
      prev.map((i) =>
        i.id === interviewId ? { ...i, rescheduleRequested: true } : i,
      ),
    );
    setRescheduleModal({ open: false });
    loadInterviews();
  }

  const scheduledInterviews = useMemo(
    () =>
      Array.isArray(interviews) ? interviews.filter(isScheduledInterview) : [],
    [interviews],
  );

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== "ALL" ||
    modeFilter !== "ALL";

  const filteredInterviews = useMemo(
    () =>
      scheduledInterviews.filter((i) =>
        matchesFilters(i, searchQuery, statusFilter, modeFilter),
      ),
    [scheduledInterviews, searchQuery, statusFilter, modeFilter],
  );

  const upcomingInterviews = useMemo(
    () =>
      filteredInterviews
        .filter(isUpcoming)
        .sort(
          (a, b) =>
            new Date(a.scheduledAt!).getTime() -
            new Date(b.scheduledAt!).getTime(),
        ),
    [filteredInterviews],
  );

  const pastInterviews = useMemo(
    () =>
      filteredInterviews
        .filter(isPast)
        .sort(
          (a, b) =>
            new Date(b.scheduledAt!).getTime() -
            new Date(a.scheduledAt!).getTime(),
        ),
    [filteredInterviews],
  );

  const nextInterview = upcomingInterviews[0];
  const restUpcoming = upcomingInterviews.slice(1);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const allUpcoming = scheduledInterviews.filter(isUpcoming);
    const completedThisMonth = scheduledInterviews.filter(
      (i) =>
        i.status === InterviewStatus.COMPLETED &&
        i.scheduledAt &&
        new Date(i.scheduledAt) >= monthStart,
    ).length;

    const pendingConfirmation = allUpcoming.filter(
      (i) => i.candidateResponseStatus === CandidateResponseStatus.PENDING,
    ).length;

    return {
      upcomingCount: allUpcoming.length,
      completedThisMonth,
      pendingConfirmation,
    };
  }, [scheduledInterviews]);

  const viewSource = useMemo(() => {
    if (viewMode === "timeline") return pastInterviews;
    return [...upcomingInterviews, ...pastInterviews];
  }, [viewMode, upcomingInterviews, pastInterviews]);

  const totalPages = Math.max(1, Math.ceil(viewSource.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedViewSource = useMemo(
    () =>
      viewSource.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE,
      ),
    [viewSource, safePage],
  );

  const pastGroupedByDate = useMemo(
    () => groupByDate(paginatedViewSource),
    [paginatedViewSource],
  );
  const groupedByMonth = useMemo(
    () => groupByMonth(paginatedViewSource),
    [paginatedViewSource],
  );

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("ALL");
    setModeFilter("ALL");
  }

  async function handleJoin(
    e: React.MouseEvent,
    interview: GetCandidateInterviewsResponse,
  ) {
    e.stopPropagation();
    if (!interview.id) return;
    setJoinError(null);
    setJoiningId(interview.id);
    const result = await submitJoin(interview.id);
    setJoiningId(null);
    if (result && interview.meetingLink) {
      window.open(interview.meetingLink, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="fixed left-0 top-16 bottom-0 w-60 z-40 overflow-y-auto border-r border-slate-100 bg-white">
        <Sidebar />
      </div>

      <div className="ml-60 pt-16 flex flex-col min-h-screen">
        <div className="px-8 py-6">
          {loading && interviews.length === 0 && (
            <div className="flex items-center justify-center py-24 gap-3 text-slate-400 bg-white rounded-xl border border-slate-200 mb-6">
              <Loader2 size={20} className="animate-spin text-blue-500" />
              <span className="text-sm font-medium">
                Loading your interviews…
              </span>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-500 bg-white rounded-xl border border-slate-200 mb-6">
              <AlertCircle size={28} />
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={loadInterviews}
                className="text-xs px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600 font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {(!loading || interviews.length > 0) && !error && (
            <>
              {joinError && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2.5">
                  <AlertCircle
                    size={14}
                    className="text-red-500 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-red-600">{joinError}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mb-6">
                <StatCard
                  icon={Clock}
                  iconColor="text-blue-500"
                  iconBg="bg-blue-50"
                  label="Upcoming"
                  value={stats.upcomingCount}
                  hint={
                    stats.upcomingCount === 0
                      ? "Nothing scheduled"
                      : "Scheduled & confirmed"
                  }
                />
                <StatCard
                  icon={CheckCircle2}
                  iconColor="text-emerald-500"
                  iconBg="bg-emerald-50"
                  label="Completed"
                  value={stats.completedThisMonth}
                  hint="This month"
                />
                <StatCard
                  icon={AlertCircle}
                  iconColor="text-amber-500"
                  iconBg="bg-amber-50"
                  label="Pending confirmation"
                  value={stats.pendingConfirmation}
                  hint={
                    stats.pendingConfirmation > 0
                      ? "Needs your response"
                      : "All caught up"
                  }
                  badge={stats.pendingConfirmation > 0}
                />
              </div>

              {nextInterview && (
                <div
                  onClick={() => goToInterview(nextInterview)}
                  className="mb-6 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 p-5 text-white shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <Sparkles className="absolute -right-4 -top-4 w-28 h-28 text-white/10" />
                  <div className="relative flex items-center justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide bg-white/15 px-2 py-0.5 rounded-full">
                          <CalendarClock size={11} /> Next up
                        </span>
                        <span className="text-xs text-blue-100">
                          {formatRelative(nextInterview.scheduledAt!)}
                        </span>
                        {nextInterview.candidateResponseStatus ===
                          CandidateResponseStatus.PENDING && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-amber-400/90 text-amber-950 px-2 py-0.5 rounded-full">
                            Awaiting your response
                          </span>
                        )}
                        {nextInterview.rescheduleRequested && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-white/15 px-2 py-0.5 rounded-full">
                            <Hourglass size={9} /> Reschedule requested
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-bold truncate">
                        {nextInterview.title || "Interview"}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-blue-100 mt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />{" "}
                          {formatDateLabel(nextInterview.scheduledAt!)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} />{" "}
                          {formatTime(nextInterview.scheduledAt!)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          {inferMode(nextInterview) === InterviewMode.ONLINE ? (
                            <Video size={13} />
                          ) : (
                            <MapPin size={13} />
                          )}
                          {inferMode(nextInterview) === InterviewMode.ONLINE
                            ? "Online"
                            : nextInterview.location || "In-person"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {needsResponse(nextInterview) ? (
                        <button
                          onClick={(e) => openDecision(e, nextInterview)}
                          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-colors"
                        >
                          <CheckCircle2 size={14} />
                          Respond
                        </button>
                      ) : (
                        <>
                          {canRequestReschedule(nextInterview) && (
                            <button
                              onClick={(e) =>
                                openRescheduleRequest(e, nextInterview)
                              }
                              className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2.5 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors"
                            >
                              <RefreshCw size={13} />
                              Reschedule
                            </button>
                          )}
                          {inferMode(nextInterview) === InterviewMode.ONLINE &&
                            nextInterview.meetingLink && (
                              <button
                                onClick={(e) => handleJoin(e, nextInterview)}
                                disabled={
                                  !canJoinNow(nextInterview) ||
                                  joiningId === nextInterview.id
                                }
                                className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors ${
                                  canJoinNow(nextInterview)
                                    ? "bg-white text-blue-700 hover:bg-blue-50"
                                    : "bg-white/15 text-white/60 cursor-not-allowed"
                                }`}
                                title={
                                  canJoinNow(nextInterview)
                                    ? "Join the interview"
                                    : "Join link opens 15 minutes before start"
                                }
                              >
                                {joiningId === nextInterview.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <ExternalLink size={14} />
                                )}
                                Join interview
                              </button>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {restUpcoming.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-slate-900">
                      Upcoming Interviews
                    </h2>
                    <span className="text-xs text-slate-400 font-medium">
                      {restUpcoming.length} scheduled
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {restUpcoming.map((interview) => {
                      const mode = inferMode(interview);
                      const statusCfg = getStatusConfig(interview);
                      const responseCfg = getResponseConfig(interview);
                      const joinable = canJoinNow(interview);
                      const pendingResponse = needsResponse(interview);
                      return (
                        <div
                          key={interview.id}
                          onClick={() => goToInterview(interview)}
                          className="relative bg-white rounded-xl border border-slate-200 pl-4 pr-4 py-4 hover:shadow-md hover:border-slate-300 transition-all overflow-hidden cursor-pointer"
                        >
                          <span
                            className={`absolute left-0 top-0 bottom-0 w-1 ${statusCfg.bar}`}
                          />

                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-semibold text-slate-900 text-sm truncate">
                              {interview.title || "Interview"}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${statusCfg.pill}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                              />
                              {statusCfg.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap mb-2.5">
                            {responseCfg && (
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${responseCfg.pill}`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${responseCfg.dot}`}
                                />
                                {responseCfg.label}
                              </span>
                            )}
                            {interview.rescheduleRequested && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                                <Hourglass size={9} /> Reschedule requested
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />{" "}
                              {formatDateLabel(interview.scheduledAt!)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />{" "}
                              {formatTime(interview.scheduledAt!)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md shrink-0">
                              {mode === InterviewMode.ONLINE ? (
                                <Video size={11} />
                              ) : (
                                <MapPin size={11} />
                              )}
                              {mode === InterviewMode.ONLINE
                                ? "Online"
                                : interview.location || "In-person"}
                            </span>

                            {pendingResponse ? (
                              <button
                                onClick={(e) => openDecision(e, interview)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors"
                              >
                                <CheckCircle2 size={12} />
                                Respond
                              </button>
                            ) : mode === InterviewMode.ONLINE &&
                              interview.meetingLink ? (
                              <button
                                onClick={(e) => handleJoin(e, interview)}
                                disabled={
                                  !joinable || joiningId === interview.id
                                }
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                                  joinable
                                    ? "text-white bg-blue-600 hover:bg-blue-700"
                                    : "text-slate-400 bg-slate-100 cursor-not-allowed"
                                }`}
                                title={
                                  joinable
                                    ? "Join the interview"
                                    : "Join link opens 15 minutes before start"
                                }
                              >
                                {joiningId === interview.id ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <ExternalLink size={12} />
                                )}
                                Join
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                {formatRelative(interview.scheduledAt!)}
                              </span>
                            )}
                          </div>

                          {!pendingResponse &&
                            canRequestReschedule(interview) && (
                              <button
                                onClick={(e) =>
                                  openRescheduleRequest(e, interview)
                                }
                                className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-2 py-1 rounded-md transition-colors"
                              >
                                <RefreshCw size={10} /> Request reschedule
                              </button>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-200 mb-6 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                    {[
                      {
                        mode: "timeline" as const,
                        icon: Clock,
                        label: "Timeline",
                      },
                      {
                        mode: "calendar" as const,
                        icon: Calendar,
                        label: "Calendar",
                      },
                      { mode: "list" as const, icon: ListTodo, label: "List" },
                    ].map((item) => (
                      <button
                        key={item.mode}
                        onClick={() => setViewMode(item.mode)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                          viewMode === item.mode
                            ? "bg-white text-blue-700 font-semibold shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="relative flex-1 min-w-50 max-w-sm">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by role or title…"
                      className="w-full pl-8 pr-8 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <FilterSelect
                    value={statusFilter}
                    onChange={(v) => setStatusFilter(v as StatusFilter)}
                    options={[
                      { value: "ALL", label: "All statuses" },
                      { value: InterviewStatus.SCHEDULED, label: "Scheduled" },
                      {
                        value: InterviewStatus.RESCHEDULED,
                        label: "Rescheduled",
                      },
                      { value: InterviewStatus.ONGOING, label: "Ongoing" },
                      { value: InterviewStatus.COMPLETED, label: "Completed" },
                      { value: InterviewStatus.CANCELLED, label: "Cancelled" },
                      { value: InterviewStatus.NO_SHOW, label: "No Show" },
                    ]}
                  />
                  <FilterSelect
                    value={modeFilter}
                    onChange={(v) => setModeFilter(v as ModeFilter)}
                    options={[
                      { value: "ALL", label: "All formats" },
                      { value: InterviewMode.ONLINE, label: "Online" },
                      { value: InterviewMode.OFFLINE, label: "In-person" },
                    ]}
                  />
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <X size={12} /> Clear filters
                    </button>
                  )}
                </div>
              </div>

              {scheduledInterviews.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-2 text-slate-400 bg-white rounded-xl border border-slate-200">
                  <Calendar size={36} className="text-slate-200" />
                  <p className="text-sm font-semibold text-slate-500 mt-2">
                    No interviews yet
                  </p>
                  <p className="text-xs text-slate-400">
                    Once a recruiter schedules an interview, it'll show up here.
                  </p>
                </div>
              )}

              {scheduledInterviews.length > 0 &&
                filteredInterviews.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-24 gap-2 text-slate-400 bg-white rounded-xl border border-slate-200">
                    <Search size={32} className="text-slate-200" />
                    <p className="text-sm font-semibold text-slate-500 mt-2">
                      No interviews match your search
                    </p>
                    <button
                      onClick={clearFilters}
                      className="text-xs px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 font-medium mt-1"
                    >
                      Clear filters
                    </button>
                  </div>
                )}

              {viewMode === "timeline" && pastInterviews.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3">
                    Past & Completed Interviews
                  </h2>
                  <div className="space-y-2.5">
                    {Object.entries(pastGroupedByDate).map(
                      ([date, dateInterviews]) => (
                        <div
                          key={date}
                          className="bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-all"
                        >
                          <button
                            onClick={() => toggleDate(date)}
                            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span className="font-semibold text-slate-900 text-sm">
                                {date}
                              </span>
                              <span className="text-xs text-slate-400">
                                {dateInterviews.length} interview
                                {dateInterviews.length === 1 ? "" : "s"}
                              </span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform ${expandedDates[date] ? "rotate-180" : ""}`}
                            />
                          </button>

                          {expandedDates[date] && (
                            <div className="border-t border-slate-200 bg-slate-50 rounded-b-xl">
                              <div className="p-4 space-y-2.5">
                                {dateInterviews.map((interview) => {
                                  const statusCfg = getStatusConfig(interview);
                                  const responseCfg =
                                    getResponseConfig(interview);
                                  return (
                                    <div
                                      key={interview.id}
                                      onClick={() => goToInterview(interview)}
                                      className="relative flex items-center justify-between p-3.5 pl-4 bg-white rounded-lg border border-slate-200 hover:shadow-sm hover:border-slate-300 transition-all overflow-hidden cursor-pointer"
                                    >
                                      <span
                                        className={`absolute left-0 top-0 bottom-0 w-1 ${statusCfg.bar}`}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <p className="font-semibold text-slate-900 text-sm truncate">
                                            {interview.title || "Interview"}
                                          </p>
                                          <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${statusCfg.pill}`}
                                          >
                                            <span
                                              className={`w-1 h-1 rounded-full ${statusCfg.dot}`}
                                            />
                                            {statusCfg.label}
                                          </span>
                                          {responseCfg && (
                                            <span
                                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${responseCfg.pill}`}
                                            >
                                              <span
                                                className={`w-1 h-1 rounded-full ${responseCfg.dot}`}
                                              />
                                              {responseCfg.label}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                          {formatTime(interview.scheduledAt!)}
                                        </p>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                  <PaginationBar
                    page={safePage}
                    totalPages={totalPages}
                    totalItems={viewSource.length}
                    pageSize={ITEMS_PER_PAGE}
                    onChange={setCurrentPage}
                  />
                </div>
              )}

              {viewMode === "list" && filteredInterviews.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3">
                    All Interviews
                  </h2>
                  <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                    {paginatedViewSource.map((interview) => {
                      const statusCfg = getStatusConfig(interview);
                      const responseCfg = getResponseConfig(interview);
                      const mode = inferMode(interview);
                      return (
                        <div
                          key={interview.id}
                          onClick={() => goToInterview(interview)}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="shrink-0 w-12 text-center">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase">
                              {interview.scheduledAt
                                ? formatWeekday(interview.scheduledAt)
                                : "—"}
                            </p>
                            <p className="text-base font-bold text-slate-800">
                              {interview.scheduledAt
                                ? formatDayNumber(interview.scheduledAt)
                                : "—"}
                            </p>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">
                              {interview.title || "Interview"}
                            </p>
                            {interview.rescheduleRequested && (
                              <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                                <Hourglass size={9} /> Reschedule requested
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                            <Clock size={12} />{" "}
                            {interview.scheduledAt
                              ? formatTime(interview.scheduledAt)
                              : "—"}
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md shrink-0">
                            {mode === InterviewMode.ONLINE ? (
                              <Video size={11} />
                            ) : (
                              <MapPin size={11} />
                            )}
                            {mode === InterviewMode.ONLINE
                              ? "Online"
                              : "In-person"}
                          </span>
                          {responseCfg && (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold shrink-0 ${responseCfg.pill}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${responseCfg.dot}`}
                              />
                              {responseCfg.label}
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${statusCfg.pill}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                            />
                            {statusCfg.label}
                          </span>
                          {needsResponse(interview) && (
                            <button
                              onClick={(e) => openDecision(e, interview)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors shrink-0"
                            >
                              Respond
                            </button>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                  <PaginationBar
                    page={safePage}
                    totalPages={totalPages}
                    totalItems={viewSource.length}
                    pageSize={ITEMS_PER_PAGE}
                    onChange={setCurrentPage}
                  />
                </div>
              )}

              {viewMode === "calendar" && filteredInterviews.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3">
                    Interviews by Month
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(groupedByMonth)
                      .sort(
                        (a, b) =>
                          new Date(b[1][0].scheduledAt!).getTime() -
                          new Date(a[1][0].scheduledAt!).getTime(),
                      )
                      .map(([month, monthInterviews]) => (
                        <div
                          key={month}
                          className="bg-white rounded-xl border border-slate-200 p-5"
                        >
                          <h3 className="text-sm font-bold text-slate-900 mb-3.5">
                            {month}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {monthInterviews
                              .slice()
                              .sort(
                                (a, b) =>
                                  new Date(a.scheduledAt!).getTime() -
                                  new Date(b.scheduledAt!).getTime(),
                              )
                              .map((interview) => {
                                const statusCfg = getStatusConfig(interview);
                                return (
                                  <div
                                    key={interview.id}
                                    onClick={() => goToInterview(interview)}
                                    className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer"
                                  >
                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex flex-col items-center justify-center">
                                      <span className="text-[8px] font-bold text-blue-500 uppercase leading-none">
                                        {formatWeekday(interview.scheduledAt!)}
                                      </span>
                                      <span className="text-sm font-bold text-blue-700 leading-none mt-0.5">
                                        {formatDayNumber(
                                          interview.scheduledAt!,
                                        )}
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-semibold text-slate-800 truncate">
                                        {interview.title || "Interview"}
                                      </p>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span
                                          className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                                        />
                                        <p className="text-xs text-slate-400">
                                          {statusCfg.label} ·{" "}
                                          {formatTime(interview.scheduledAt!)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      ))}
                  </div>
                  <PaginationBar
                    page={safePage}
                    totalPages={totalPages}
                    totalItems={viewSource.length}
                    pageSize={ITEMS_PER_PAGE}
                    onChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <footer className="mt-auto bg-white border-t border-slate-200 px-8 py-5 text-center text-sm text-slate-500">
          <p>© 2025 My Interviews. All rights reserved.</p>
        </footer>
      </div>

      <InterviewDecisionModal
        isOpen={decisionModal.open}
        onClose={closeDecisionModal}
        interview={decisionModal.interview}
        onAccepted={handleAccepted}
        onRejected={handleRejected}
      />

      <RequestRescheduleModal
        isOpen={rescheduleModal.open}
        onClose={closeRescheduleModal}
        interview={rescheduleModal.interview}
        onRequested={handleRescheduleRequested}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  hint,
  badge,
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  value: number;
  hint: string;
  badge?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex items-center gap-3.5">
      <div
        className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-2xl font-bold text-slate-900 leading-none">
            {value}
          </p>
          {badge && (
            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide">
              Action
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-slate-600 mt-1 truncate">
          {label}
        </p>
        <p className="text-[11px] text-slate-400 truncate">{hint}</p>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function PaginationBar({
  page,
  totalPages,
  totalItems,
  pageSize,
  onChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);
  const sequence = buildPageSequence(page, totalPages, PAGE_WINDOW);

  return (
    <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
      <p className="text-xs text-slate-400">
        Showing{" "}
        <span className="font-semibold text-slate-600">
          {rangeStart}–{rangeEnd}
        </span>{" "}
        of <span className="font-semibold text-slate-600">{totalItems}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(1)}
          disabled={page === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="First page"
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {sequence.map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-slate-300 text-sm select-none"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onChange(item)}
              className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                item === page
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ),
        )}

        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
        <button
          onClick={() => onChange(totalPages)}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Last page"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}
