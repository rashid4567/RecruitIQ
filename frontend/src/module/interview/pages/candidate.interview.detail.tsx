"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  User,
  Zap,
  Calendar,
  CalendarPlus,
  ListTodo,
  Clock,
  ChevronLeft,
  AlertCircle,
  Loader2,
  Video,
  MapPin,
  Building2,
  ExternalLink,
  ArrowUpRight,
  FileText,
  Hash,
  StickyNote,
  XCircle,
  CheckCircle2,
  UserCheck,
  Copy,
  BellRing,
} from "lucide-react";
import { useCandidateInterviewDetails } from "../hooks/candidate/useCandidateInterviewDetails";
import { useJoinInterview } from "../hooks/candidate/useJoinInterview";
import type { GetCandidateInterviewDetailsResponse } from "../types/candidateInterview.types";
import { InterviewMode, InterviewStatus } from "../types/interview.types";
import Header from "@/pages/landing/sections/Header";

// ─── props ─────────────────────────────────────────────────────────────────────

export interface MyInterviewDetailsProps {
  /** Optional override — if not passed, the `:interviewId` route param is used. */
  id?: string;
  /** Called when the candidate wants to return to the interviews list. Falls back to browser back. */
  onBack?: () => void;
}

// ─── formatting helpers ────────────────────────────────────────────────────────

function formatDateLabel(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(minutes?: number): string {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

// ─── calendar export (.ics) ────────────────────────────────────────────────────

function escapeIcs(text: string): string {
  return text.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
}

function toIcsTimestamp(d: Date): string {
  return `${d.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

function buildIcsContent(
  details: GetCandidateInterviewDetailsResponse,
): string {
  const start = new Date(details.scheduledAt);
  const end = new Date(start.getTime() + details.durationInMinutes * 60000);
  const locationOrLink =
    details.mode === InterviewMode.ONLINE
      ? (details.meetingLink ?? "")
      : (details.location ?? "");
  const descriptionParts = [
    details.description ?? "",
    details.mode === InterviewMode.ONLINE && details.meetingLink
      ? `Meeting link: ${details.meetingLink}`
      : "",
  ].filter(Boolean);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RecruitIQ//Interview//EN",
    "BEGIN:VEVENT",
    `UID:${details.id}@recruitiq`,
    `DTSTAMP:${toIcsTimestamp(new Date())}`,
    `DTSTART:${toIcsTimestamp(start)}`,
    `DTEND:${toIcsTimestamp(end)}`,
    `SUMMARY:${escapeIcs(details.title)}`,
    descriptionParts.length
      ? `DESCRIPTION:${escapeIcs(descriptionParts.join("\n"))}`
      : "",
    locationOrLink ? `LOCATION:${escapeIcs(locationOrLink)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.filter(Boolean).join("\r\n");
}

// ─── status + timing logic ─────────────────────────────────────────────────────

interface StatusConfig {
  label: string;
  pill: string;
  dot: string;
  accent: string;
  heroTint: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  [InterviewStatus.SCHEDULED]: {
    label: "Scheduled",
    pill: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    accent: "bg-blue-500",
    heroTint: "bg-white border-slate-200",
  },
  [InterviewStatus.RESCHEDULED]: {
    label: "Rescheduled",
    pill: "bg-violet-50 text-violet-700 border border-violet-200",
    dot: "bg-violet-500",
    accent: "bg-violet-500",
    heroTint: "bg-white border-slate-200",
  },
  [InterviewStatus.ONGOING]: {
    label: "Live now",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    accent: "bg-emerald-500",
    heroTint: "bg-emerald-50/40 border-emerald-200",
  },
  [InterviewStatus.COMPLETED]: {
    label: "Completed",
    pill: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
    accent: "bg-slate-300",
    heroTint: "bg-white border-slate-200",
  },
  [InterviewStatus.CANCELLED]: {
    label: "Cancelled",
    pill: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    accent: "bg-red-500",
    heroTint: "bg-red-50/40 border-red-200",
  },
  [InterviewStatus.NO_SHOW]: {
    label: "No Show",
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    accent: "bg-amber-500",
    heroTint: "bg-amber-50/30 border-amber-200",
  },
};

function getStatusConfig(status?: InterviewStatus): StatusConfig {
  return (
    STATUS_CONFIG[status ?? ""] ?? {
      label: "Pending",
      pill: "bg-slate-50 text-slate-500 border border-slate-200",
      dot: "bg-slate-300",
      accent: "bg-slate-200",
      heroTint: "bg-white border-slate-200",
    }
  );
}

const ACTIVE_STATUSES: string[] = [
  InterviewStatus.SCHEDULED,
  InterviewStatus.RESCHEDULED,
  InterviewStatus.ONGOING,
];
const JOINABLE_WINDOW_MS = 15 * 60 * 1000;

function canJoinNow(
  details: GetCandidateInterviewDetailsResponse,
  now: number,
): boolean {
  if (details.mode !== InterviewMode.ONLINE || !details.meetingLink)
    return false;
  if (details.status === InterviewStatus.ONGOING) return true;
  if (!ACTIVE_STATUSES.includes(details.status)) return false;
  const start = new Date(details.scheduledAt).getTime();
  const duration = details.durationInMinutes * 60 * 1000;
  return now >= start - JOINABLE_WINDOW_MS && now <= start + duration;
}

/** A short, human "Starts in 2h 15m" / "Live now" / "In progress" chip label. Returns null once it's no longer relevant. */
function getCountdownLabel(
  details: GetCandidateInterviewDetailsResponse,
  now: number,
): string | null {
  if (!ACTIVE_STATUSES.includes(details.status)) return null;
  if (details.status === InterviewStatus.ONGOING) return "Live now";

  const start = new Date(details.scheduledAt).getTime();
  const diffMs = start - now;

  if (diffMs <= 0) {
    const end = start + details.durationInMinutes * 60 * 1000;
    return now <= end ? "In progress" : null;
  }

  const totalMinutes = Math.round(diffMs / 60000);
  if (totalMinutes < 1) return "Starting now";
  if (totalMinutes < 60) return `Starts in ${totalMinutes}m`;

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours < 24) return `Starts in ${hours}h${mins ? ` ${mins}m` : ""}`;

  const days = Math.floor(hours / 24);
  return `Starts in ${days}d`;
}

// ─── component ─────────────────────────────────────────────────────────────────

export default function MyInterviewDetails({
  id: idProp,
  onBack,
}: MyInterviewDetailsProps) {
  const { interviewId: idParam } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const id = idProp ?? idParam ?? "";

  const [details, setDetails] =
    useState<GetCandidateInterviewDetailsResponse | null>(null);
  const [joining, setJoining] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const { getDetails, loading, error } = useCandidateInterviewDetails();
  const {
    submit: submitJoin,
    error: joinError,
    setError: setJoinError,
  } = useJoinInterview();

  async function loadDetails() {
    if (!id) return;
    const result = await getDetails(id);
    if (result) setDetails(result);
  }

  useEffect(() => {
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Keep the countdown / join-window fresh without requiring a manual refresh.
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  function handleBack() {
    if (onBack) onBack();
    else navigate(-1);
  }

  async function handleJoin() {
    if (!details) return;
    setJoinError(null);
    setJoining(true);
    const result = await submitJoin(details.id);
    setJoining(false);
    if (result) {
      setDetails((prev) =>
        prev
          ? {
              ...prev,
              candidateJoinedAt: result.candidateJoinedAt,
              status: result.status,
            }
          : prev,
      );
      if (details.meetingLink)
        window.open(details.meetingLink, "_blank", "noopener,noreferrer");
      loadDetails();
    }
  }

  function handleCopyLink() {
    if (!details?.meetingLink) return;
    navigator.clipboard.writeText(details.meetingLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  function handleAddToCalendar() {
    if (!details) return;
    const ics = buildIcsContent(details);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${details.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "interview"}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const statusCfg = getStatusConfig(details?.status);
  const joinable = details ? canJoinNow(details, now) : false;
  const isCancelled = details?.status === InterviewStatus.CANCELLED;
  const isOngoing = details?.status === InterviewStatus.ONGOING;
  const isUpcoming = details ? ACTIVE_STATUSES.includes(details.status) : false;
  const countdown = details ? getCountdownLabel(details, now) : null;
  const isOnline = details?.mode === InterviewMode.ONLINE;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Sidebar — hidden below lg so it never overlaps content on smaller screens */}
      <div className="hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">RecruitIQ</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard" },
            { icon: Briefcase, label: "My Applications" },
            { icon: User, label: "My Profile" },
            { icon: Zap, label: "Jobs" },
            { icon: Calendar, label: "My Interviews", active: true },
            { icon: ListTodo, label: "Resume" },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header />

        <div className="px-4 sm:px-8 py-8 max-w-5xl w-full mx-auto lg:mx-0">
          {/* Back nav */}
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-5 transition-colors"
          >
            <ChevronLeft size={16} />
            Back to interviews
          </button>

          {/* Loading skeleton */}
          {loading && !details && <DetailsSkeleton />}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-500 bg-white rounded-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle size={22} />
              </div>
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={loadDetails}
                className="text-xs px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600 font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && !details && (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400 bg-white rounded-2xl border border-slate-200">
              <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center">
                <Calendar size={26} className="text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                Interview not found
              </p>
              <p className="text-xs text-slate-400">
                It may have been removed, or the link is incorrect.
              </p>
            </div>
          )}

          {details && (
            <div className="space-y-5">
              {joinError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2.5">
                  <AlertCircle
                    size={14}
                    className="text-red-500 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-red-600">{joinError}</p>
                </div>
              )}

              {/* ── Hero / header card ── */}
              <div
                className={`relative overflow-hidden rounded-2xl border p-6 pl-7 shadow-sm ${statusCfg.heroTint}`}
              >
                <span
                  className={`absolute inset-y-0 left-0 w-1.5 ${statusCfg.accent}`}
                />

                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.pill}`}
                      >
                        {isOngoing ? (
                          <PulseDot />
                        ) : (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                          />
                        )}
                        {statusCfg.label}
                      </span>
                      {countdown && !isOngoing && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                          <Clock size={11} /> {countdown}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 truncate">
                      {details.title}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                      <Hash size={13} /> Round {details.round}
                    </p>

                    {/* Quick-scan meta row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />{" "}
                        {formatShortDate(details.scheduledAt)}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} /> {formatTime(details.scheduledAt)} ·{" "}
                        {formatDuration(details.durationInMinutes)}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="inline-flex items-center gap-1">
                        {isOnline ? <Video size={12} /> : <MapPin size={12} />}
                        {isOnline ? "Online" : details.location || "In-person"}
                      </span>
                    </div>
                  </div>

                  {isOnline && details.meetingLink && !isCancelled && (
                    <button
                      onClick={handleJoin}
                      disabled={!joinable || joining}
                      className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors flex-shrink-0 ${
                        joinable
                          ? "text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200"
                          : "text-slate-400 bg-slate-100 cursor-not-allowed"
                      }`}
                      title={
                        joinable
                          ? "Join the interview"
                          : "Join link opens 15 minutes before start"
                      }
                    >
                      {joining ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <ExternalLink size={15} />
                      )}
                      {isOngoing ? "Join Now" : "Join Interview"}
                    </button>
                  )}
                </div>

                {details.candidateJoinedAt && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <UserCheck size={12} /> You joined at{" "}
                    {formatDateTime(details.candidateJoinedAt)}
                  </div>
                )}
              </div>

              {/* ── Cancellation banner ── */}
              {isCancelled && (
                <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                  <h3 className="text-sm font-bold text-red-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <XCircle size={13} /> Interview Cancelled
                  </h3>
                  {details.cancelledReason && (
                    <p className="text-sm text-red-700">
                      {details.cancelledReason}
                    </p>
                  )}
                  {details.cancelledBy && (
                    <p className="text-xs text-red-500 mt-1">
                      Cancelled by {details.cancelledBy}
                    </p>
                  )}
                </div>
              )}

              {/* ── Body grid ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                {/* Main column */}
                <div className="lg:col-span-2 space-y-5">
                  {/* Schedule details */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">
                      Schedule
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DetailRow
                        icon={<Calendar size={14} />}
                        label="Date"
                        value={formatDateLabel(details.scheduledAt)}
                      />
                      <DetailRow
                        icon={<Clock size={14} />}
                        label="Time"
                        value={formatTime(details.scheduledAt)}
                      />
                      <DetailRow
                        icon={<Clock size={14} />}
                        label="Duration"
                        value={formatDuration(details.durationInMinutes)}
                      />
                      <DetailRow
                        icon={
                          isOnline ? <Video size={14} /> : <MapPin size={14} />
                        }
                        label="Format"
                        value={isOnline ? "Online" : "In-person"}
                      />
                      {!isOnline && details.location && (
                        <DetailRow
                          icon={<MapPin size={14} />}
                          label="Location"
                          value={details.location}
                        />
                      )}
                      {!isOnline && details.roomId && (
                        <DetailRow
                          icon={<Building2 size={14} />}
                          label="Room"
                          value={details.roomId}
                        />
                      )}
                    </div>

                    {isOnline && details.meetingLink && (
                      <div className="mt-4 bg-slate-50 rounded-xl border border-slate-200 p-4">
                        <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                          Meeting link
                        </p>
                        <div className="flex items-center gap-2">
                          <a
                            href={details.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 break-all flex-1 min-w-0"
                          >
                            {details.meetingLink}
                          </a>
                          <button
                            onClick={handleCopyLink}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              linkCopied
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <Copy size={11} />
                            {linkCopied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description / notes */}
                  {(details.description || details.notes) && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                      {details.description && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <FileText size={13} /> Description
                          </h3>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">
                            {details.description}
                          </p>
                        </div>
                      )}
                      {details.notes && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <StickyNote size={13} /> Notes
                          </h3>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">
                            {details.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sidebar column */}
                <div className="space-y-5 lg:sticky lg:top-6">
                  {/* Quick actions */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                      Quick actions
                    </h3>
                    <div className="space-y-2">
                      {isOnline && details.meetingLink && !isCancelled && (
                        <button
                          onClick={handleJoin}
                          disabled={!joinable || joining}
                          className={`w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors ${
                            joinable
                              ? "text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200"
                              : "text-slate-400 bg-slate-100 cursor-not-allowed"
                          }`}
                        >
                          {joining ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <ExternalLink size={14} />
                          )}
                          {isOngoing ? "Join Now" : "Join Interview"}
                        </button>
                      )}

                      {isOnline && details.meetingLink && (
                        <button
                          onClick={handleCopyLink}
                          className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Copy size={14} />
                          {linkCopied ? "Link copied!" : "Copy meeting link"}
                        </button>
                      )}

                      {isUpcoming && (
                        <button
                          onClick={handleAddToCalendar}
                          className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <CalendarPlus size={14} />
                          Add to calendar
                        </button>
                      )}

                      {details.applicationId && (
                        <Link
                          to={`../applications/${details.applicationId}`}
                          className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          View application
                          <ArrowUpRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* At a glance */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                      At a glance
                    </h3>
                    <div className="space-y-3">
                      <GlanceRow
                        icon={<Hash size={13} />}
                        label="Round"
                        value={String(details.round)}
                      />
                      <GlanceRow
                        icon={<Clock size={13} />}
                        label="Duration"
                        value={formatDuration(details.durationInMinutes)}
                      />
                      <GlanceRow
                        icon={
                          isOnline ? <Video size={13} /> : <MapPin size={13} />
                        }
                        label="Format"
                        value={isOnline ? "Online" : "In-person"}
                      />
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <BellRing size={13} className="text-slate-400" />{" "}
                          Reminder
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            details.reminderSent
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {details.reminderSent ? "Sent" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Activity timeline */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">
                      Activity
                    </h3>
                    <ActivityTimeline
                      items={[
                        {
                          label: "Interview scheduled",
                          time: formatDateTime(details.createdAt),
                          done: true,
                          muted: true,
                        },
                        { label: "Reminder sent", done: details.reminderSent },
                        ...(details.startedAt
                          ? [
                              {
                                label: "Interview started",
                                time: formatDateTime(details.startedAt),
                                done: true,
                              },
                            ]
                          : []),
                        ...(details.recruiterJoinedAt
                          ? [
                              {
                                label: "Recruiter joined",
                                time: formatDateTime(details.recruiterJoinedAt),
                                done: true,
                              },
                            ]
                          : []),
                        ...(details.candidateJoinedAt
                          ? [
                              {
                                label: "You joined",
                                time: formatDateTime(details.candidateJoinedAt),
                                done: true,
                              },
                            ]
                          : []),
                        ...(details.endedAt
                          ? [
                              {
                                label: "Interview ended",
                                time: formatDateTime(details.endedAt),
                                done: true,
                              },
                            ]
                          : []),
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-auto bg-white border-t border-slate-200 px-8 py-6 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} RecruitIQ. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

// ─── sub-components ─────────────────────────────────────────────────────────────

function PulseDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
    </span>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-400 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function GlanceRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-xs text-slate-500">
        <span className="text-slate-400">{icon}</span>
        {label}
      </span>
      <span className="text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}

interface TimelineItem {
  label: string;
  time?: string;
  done: boolean;
  muted?: boolean;
}

function ActivityTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="relative flex gap-3 pb-5 last:pb-0">
          {idx < items.length - 1 && (
            <span
              className={`absolute left-[6.5px] top-4 bottom-0 w-px ${item.done ? "bg-emerald-200" : "bg-slate-200"}`}
            />
          )}
          <span
            className={`mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center ${
              item.done
                ? item.muted
                  ? "bg-slate-300"
                  : "bg-emerald-500"
                : "border-2 border-slate-200 bg-white"
            }`}
          >
            {item.done && (
              <CheckCircle2 size={9} className="text-white" strokeWidth={3} />
            )}
          </span>
          <div className="min-w-0 -mt-0.5">
            <p
              className={`text-xs ${item.done ? (item.muted ? "text-slate-400" : "text-slate-700 font-medium") : "text-slate-400"}`}
            >
              {item.label}
            </p>
            {item.time && item.time !== "—" && (
              <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-5 animate-pulse" aria-hidden="true">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="h-5 w-24 bg-slate-200 rounded-full mb-4" />
        <div className="h-6 w-2/3 bg-slate-200 rounded mb-2" />
        <div className="h-4 w-28 bg-slate-100 rounded mb-4" />
        <div className="h-3 w-1/2 bg-slate-100 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="h-3 w-20 bg-slate-200 rounded mb-5" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-16 bg-slate-100 rounded" />
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 h-28" />
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 h-40" />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 h-32" />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 h-44" />
        </div>
      </div>
    </div>
  );
}
