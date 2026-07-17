import { useEffect, useRef, useState } from "react";
import { Clock, MapPin, MoreVertical, Video } from "lucide-react";
import type { RecruiterInterviewItem } from "@/module/interview/types/recruiterInterview.types";
import { InterviewStatus } from "@/module/interview/types/interview.types";
import {
  candidateGradient,
  canModifyInterview as canModifyInterviewStatus,
  formatScheduledAt,
  getStatusConfig,
  hasPendingRescheduleRequest,
  isInterviewScheduled,
  isToday,
  STATUS_TRANSITIONS,
} from "./Interviewdashboard.helpers";
import {
  canJoinNow,
  getJoinCountdown,
  isJoinWindowClosed,
  isWithinModifiableWindow,
} from "./utils";

const TICK_INTERVAL_MS = 15_000;


export const INTERVIEW_GRID_COLS =
  "grid-cols-[1.3fr_1.7fr_1fr_0.9fr_1fr_auto]";

interface InterviewRowProps {
  interview: RecruiterInterviewItem;
  onStatusChange: (id: string, status: InterviewStatus) => void;
  onOpenSchedule: (interview: RecruiterInterviewItem) => void;
  onOpenReschedule: (interview: RecruiterInterviewItem) => void;
  onOpenCancel: (interview: RecruiterInterviewItem) => void;
  onApproveReschedule: (interview: RecruiterInterviewItem) => void;
  onRejectReschedule: (interview: RecruiterInterviewItem) => void;
  onJoinInterview: (interview: RecruiterInterviewItem) => void;
  onOpenDetail: (interview: RecruiterInterviewItem) => void;
}

export default function InterviewRow({
  interview,
  onStatusChange,
  onOpenSchedule,
  onOpenReschedule,
  onOpenCancel,
  onApproveReschedule,
  onRejectReschedule,
  onJoinInterview,
  onOpenDetail,
}: InterviewRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { date, time } = formatScheduledAt(interview.scheduledAt);
  const linear = candidateGradient(interview.candidateId);
  const scheduled = isInterviewScheduled(interview);
  const pendingReschedule = hasPendingRescheduleRequest(interview);
  const statusCfg = getStatusConfig(interview);
  const transitions = STATUS_TRANSITIONS[interview.interviewStatus ?? ""] ?? [];
  const todayFlag = isToday(interview.scheduledAt);
  const isOnline = interview.mode === "ONLINE";
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const canJoin = canJoinNow(interview);
  const countdown = getJoinCountdown(interview);
  const windowClosed = isJoinWindowClosed(interview);
  const modifiable =
    canModifyInterviewStatus(interview) && isWithinModifiableWindow(interview);

  let joinStatusLabel: string | null = null;
  let joinStatusTone = "text-slate-400";
  if (scheduled && isOnline) {
    if (canJoin) {
      joinStatusLabel = "Live · join now";
      joinStatusTone = "text-emerald-600";
    } else if (countdown) {
      joinStatusLabel = `Opens in ${countdown}`;
      joinStatusTone = "text-indigo-500";
    } else if (windowClosed) {
      joinStatusLabel = "Window closed";
      joinStatusTone = "text-slate-400";
    }
  }

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      )
        setMobileMenuOpen(false);
    }
    if (menuOpen || mobileMenuOpen)
      document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen, mobileMenuOpen]);

  const name = interview.candidateName || interview.candidateId;
  const jobTitle = interview.jobTitle || interview.jobId;

  function handleRowClick() {
    if (!scheduled) onOpenSchedule(interview);
    else onOpenDetail(interview);
  }

 const avatar = (
  <div
    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${linear} text-xs font-bold text-white shadow-sm`}
  >
    {name.charAt(0).toUpperCase()}
  </div>
);

  const modeBadge =
    interview.mode === "ONLINE" ? (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <Video size={12} /> Online
      </span>
    ) : interview.mode === "OFFLINE" ? (
      <span
        className="inline-flex max-w-40 items-center gap-1.5 truncate whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
        title={interview.location || "In Person"}
      >
        <MapPin size={12} className="shrink-0" />
        <span className="truncate">{interview.location || "In Person"}</span>
      </span>
    ) : (
      <span className="text-xs text-slate-400">—</span>
    );

  const statusBadge = (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${statusCfg.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
      {statusCfg.label}
    </span>
  );


  function Actions() {
    return (
      <div
        className="flex items-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        {scheduled && isOnline && canJoin && (
          <button
            onClick={() => onJoinInterview(interview)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            title="Join interview"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Join
          </button>
        )}

        {scheduled && isOnline && !canJoin && countdown && (
          <button
            disabled
            title="Join opens 15 minutes before the interview starts"
            className="flex cursor-not-allowed items-center gap-1.5 whitespace-nowrap rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-400"
          >
            <Clock size={12} />
            {countdown}
          </button>
        )}

        {modifiable && (
          <>
            <button
              onClick={() => onOpenReschedule(interview)}
              title="Reschedule interview"
              className="whitespace-nowrap rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
            >
              Reschedule
            </button>
            <button
              onClick={() => onOpenCancel(interview)}
              title="Cancel interview"
              className="whitespace-nowrap rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              Cancel
            </button>
          </>
        )}

        {pendingReschedule && (
          <>
            <button
              onClick={() => onApproveReschedule(interview)}
              title="Approve reschedule request"
              className="whitespace-nowrap rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-100"
            >
              Approve
            </button>
            <button
              onClick={() => onRejectReschedule(interview)}
              title="Reject reschedule request"
              className="whitespace-nowrap rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              Reject
            </button>
          </>
        )}

        {!scheduled && (
          <button
            onClick={() => onOpenSchedule(interview)}
            title="Schedule interview"
            className="whitespace-nowrap rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            Schedule
          </button>
        )}

        {transitions.length > 0 && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              title="More actions"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <MoreVertical size={14} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-40 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                {transitions.map((t) => (
                  <button
                    key={t.status}
                    onClick={() => {
                      onStatusChange(interview.interviewId!, t.status);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }


  type MenuEntry = { key: string; label: string; tone?: "danger" | "success"; onClick: () => void };
  const secondaryEntries: MenuEntry[] = [];

  if (modifiable) {
    secondaryEntries.push({
      key: "reschedule",
      label: "Reschedule",
      onClick: () => onOpenReschedule(interview),
    });
    secondaryEntries.push({
      key: "cancel",
      label: "Cancel interview",
      tone: "danger",
      onClick: () => onOpenCancel(interview),
    });
  }
  if (pendingReschedule) {
    secondaryEntries.push({
      key: "approve",
      label: "Approve reschedule",
      tone: "success",
      onClick: () => onApproveReschedule(interview),
    });
    secondaryEntries.push({
      key: "reject",
      label: "Reject reschedule",
      tone: "danger",
      onClick: () => onRejectReschedule(interview),
    });
  }
  secondaryEntries.push({
    key: "details",
    label: "View details",
    onClick: () => onOpenDetail(interview),
  });
  transitions.forEach((t) => {
    secondaryEntries.push({
      key: t.status,
      label: t.label,
      onClick: () => onStatusChange(interview.interviewId!, t.status),
    });
  });

  function CompactActions() {
    return (
      <div
        className="flex items-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        {scheduled && isOnline && canJoin ? (
          <button
            onClick={() => onJoinInterview(interview)}
            className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            title="Join interview"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Join
          </button>
        ) : !scheduled ? (
          <button
            onClick={() => onOpenSchedule(interview)}
            title="Schedule interview"
            className="flex-1 whitespace-nowrap rounded-lg bg-blue-50 px-3 py-2 text-center text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            Schedule
          </button>
        ) : (
          <button
            onClick={() => onOpenDetail(interview)}
            className="flex-1 whitespace-nowrap rounded-lg bg-slate-100 px-3 py-2 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
          >
            View application
          </button>
        )}

        <div className="relative" ref={mobileMenuRef}>
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            title="More actions"
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100"
          >
            <MoreVertical size={16} />
          </button>

          {mobileMenuOpen && (
            <div className="absolute right-0 top-10 z-40 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
              {secondaryEntries.map((entry) => (
                <button
                  key={entry.key}
                  onClick={() => {
                    entry.onClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-slate-50 ${
                    entry.tone === "danger"
                      ? "text-red-600"
                      : entry.tone === "success"
                        ? "text-emerald-600"
                        : "text-slate-700"
                  }`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile / tablet — card layout below lg */}
      <div
        onClick={handleRowClick}
        className={`flex cursor-pointer flex-col gap-3 border-b border-slate-100 p-3.5 min-[375px]:p-4 sm:p-5 transition-colors lg:hidden ${
          pendingReschedule ? "bg-rose-50/40" : "active:bg-slate-50"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            {avatar}
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-800">
                {name}
              </div>
              <div className="truncate text-xs text-slate-400">{jobTitle}</div>
            </div>
          </div>
          {statusBadge}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
          {scheduled ? (
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Clock size={12} />
              {date} · {time}
            </span>
          ) : (
            <span className="text-slate-300">Not scheduled</span>
          )}
          {modeBadge}
          {interview.round != null && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">
              Round {interview.round}
            </span>
          )}
        </div>

        {joinStatusLabel && (
          <span className={`text-[11px] font-bold ${joinStatusTone}`}>
            {joinStatusLabel}
          </span>
        )}
        {pendingReschedule && (
          <span className="text-[11px] font-bold text-rose-600">
            ⚠ Reschedule requested
          </span>
        )}

        <CompactActions />
      </div>

      <div
        onClick={handleRowClick}
        className={`hidden ${INTERVIEW_GRID_COLS} cursor-pointer items-center gap-3 border-b border-slate-100 px-5 py-3.5 transition-colors lg:grid ${
          pendingReschedule
            ? "bg-rose-50/40 hover:bg-rose-50/60"
            : canJoin
              ? "hover:bg-emerald-50/40"
              : "hover:bg-blue-50/30"
        }`}
      >
        <div>
          {scheduled ? (
            <div className="flex items-start gap-2">
              {todayFlag && (
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500 ring-2 ring-blue-100" />
              )}
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  {date}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={11} />
                  {time}
                </div>
                {(todayFlag || joinStatusLabel) && (
                  <div className="mt-1 flex items-center gap-1">
                    {todayFlag && (
                      <span className="text-[10px] font-bold text-blue-600">
                        TODAY
                      </span>
                    )}
                    {joinStatusLabel && (
                      <span
                        className={`flex items-center gap-1 text-[10px] font-bold ${joinStatusTone}`}
                      >
                        {canJoin && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          </span>
                        )}
                        {joinStatusLabel}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <span className="text-sm text-slate-300">—</span>
          )}
        </div>

        <div className="flex min-w-0 items-center gap-2.5">
          {avatar}
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-800">
              {name}
            </div>
            <div className="hidden truncate text-xs text-slate-400 xl:block">
              {interview.candidateEmail || "—"}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-slate-700">
              {jobTitle}
            </span>
            {interview.round != null && (
              <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                R{interview.round}
              </span>
            )}
          </div>
          {interview.title && (
            <div className="hidden truncate text-xs text-slate-400 xl:block">
              {interview.title}
            </div>
          )}
        </div>

        <div>{modeBadge}</div>

        <div>
          {statusBadge}
          {pendingReschedule && (
            <div className="mt-1.5 text-[10px] font-bold text-rose-600">
              ⚠ RESCHEDULE REQ
            </div>
          )}
        </div>

        <Actions />
      </div>
    </>
  );
}