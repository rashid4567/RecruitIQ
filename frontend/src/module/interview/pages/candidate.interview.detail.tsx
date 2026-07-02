import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Calendar,
  CalendarPlus,
  Clock,
  ChevronLeft,
  ChevronRight,
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
  Hourglass,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { useCandidateInterviewDetails } from "../hooks/candidate/useCandidateInterviewDetails";
import { useJoinInterview } from "../hooks/candidate/useJoinInterview";
import type { GetCandidateInterviewDetailsResponse } from "../types/candidateInterview.types";
import {
  InterviewMode,
  InterviewStatus,
  CandidateResponseStatus,
} from "../types/interview.types";
import Sidebar from "../../candidate/pages/components/personalInfo/shared/candidateSidebar";
import Header from "@/pages/landing/sections/Header";
import InterviewDecisionModal from "./components/interview-decision-modal";
import RequestRescheduleModal from "./components/request-reschedule-modal";

import PulseDot from "./components/candidate.interview.details/Pulsedot";
import DetailRow from "./components/candidate.interview.details/Detailrow";
import StatTile from "./components/candidate.interview.details/Stattile";
import ActivityTimeline from "./components/candidate.interview.details/Activitytimeline";
import DetailsSkeleton from "./components/candidate.interview.details/Detailsskeleton";

import type { MyInterviewDetailsProps } from "./components/candidate.interview.details/Interviewdetails.types";

import {
  formatDateLabel,
  formatShortDate,
  formatTime,
  formatDateTime,
  formatDuration,
  buildIcsContent,
  getStatusConfig,
  getResponseConfig,
  ACTIVE_STATUSES,
  canJoinNow,
  getCountdownLabel,
  needsResponse,
  canRequestReschedule,
} from "./components/candidate.interview.details/Interviewdetails.helpers";

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
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);

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
  }, [id]);

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

  function handleAccepted() {
    setDetails((prev) =>
      prev
        ? { ...prev, candidateResponseStatus: CandidateResponseStatus.ACCEPTED }
        : prev,
    );
    setDecisionModalOpen(false);
    loadDetails();
  }

  function handleRejected() {
    setDetails((prev) =>
      prev
        ? { ...prev, candidateResponseStatus: CandidateResponseStatus.DECLINED }
        : prev,
    );
    setDecisionModalOpen(false);
    loadDetails();
  }

  function handleRescheduleRequested() {
    setDetails((prev) =>
      prev ? { ...prev, rescheduleRequested: true } : prev,
    );
    setRescheduleModalOpen(false);
    loadDetails();
  }

  const statusCfg = getStatusConfig(details?.status);
  const responseCfg = details
    ? getResponseConfig(details.candidateResponseStatus)
    : null;
  const joinable = details ? canJoinNow(details, now) : false;
  const isCancelled = details?.status === InterviewStatus.CANCELLED;
  const isNoShow = details?.status === InterviewStatus.NO_SHOW;
  const isCompleted = details?.status === InterviewStatus.COMPLETED;
  const isOngoing = details?.status === InterviewStatus.ONGOING;
  const isUpcoming = details ? ACTIVE_STATUSES.includes(details.status) : false;
  const countdown = details ? getCountdownLabel(details, now) : null;
  const isOnline = details?.mode === InterviewMode.ONLINE;
  const pendingResponse = details ? needsResponse(details) : false;
  const reschedulable = details ? canRequestReschedule(details) : false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <div className="flex flex-1 min-h-0">
        <div className="hidden lg:block sticky top-0 self-start h-screen shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 min-w-0 flex flex-col bg-linear-to-b from-slate-50 to-slate-100">
          <div className="sticky top-16 z-20 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200/70">
            <nav className="flex items-center gap-1.5 text-sm px-4 sm:px-8 py-3.5 max-w-5xl w-full mx-auto">
              <button
                onClick={handleBack}
                aria-label="Go back"
                className="flex items-center justify-center w-7 h-7 -ml-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleBack}
                className="text-slate-500 hover:text-slate-800 font-medium transition-colors"
              >
                Interviews
              </button>
              <ChevronRight size={13} className="text-slate-300 shrink-0" />
              <span className="text-slate-800 font-semibold truncate max-w-50 sm:max-w-sm">
                {details?.title ?? (loading ? "Loading…" : "Details")}
              </span>
            </nav>
          </div>

          <div className="px-4 sm:px-8 pt-12 pb-6 max-w-5xl w-full mx-auto flex-1">
            {loading && !details && <DetailsSkeleton />}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle size={22} className="text-red-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700">{error}</p>
                <p className="text-xs text-slate-400">
                  Something went wrong while loading this interview.
                </p>
                <button
                  onClick={loadDetails}
                  className="mt-1 text-xs px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && !details && (
              <div className="flex flex-col items-center justify-center py-20 gap-2 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center">
                  <Calendar size={26} className="text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  Interview not found
                </p>
                <p className="text-xs text-slate-400">
                  It may have been removed, or the link is incorrect.
                </p>
                <button
                  onClick={handleBack}
                  className="mt-2 text-xs px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                >
                  Back to interviews
                </button>
              </div>
            )}

            {details && (
              <div className="space-y-6">
                {joinError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2.5">
                    <AlertCircle
                      size={14}
                      className="text-red-500 shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-red-600">{joinError}</p>
                  </div>
                )}

                <div className="mt-8 relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {isOngoing && (
                    <span className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />
                  )}
                  <div className="p-6 sm:p-7">
                    <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap justify-between">
                      <div className="flex items-start gap-4 min-w-0">
                        <div
                          className={`hidden sm:flex w-12 h-12 rounded-xl items-center justify-center shrink-0 ${
                            isOnline
                              ? "bg-blue-50 text-blue-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {isOnline ? (
                            <Video size={20} />
                          ) : (
                            <MapPin size={20} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.pill}`}
                            >
                              {isOngoing ? <PulseDot /> : statusCfg.icon}
                              {statusCfg.label}
                            </span>
                            {countdown && !isOngoing && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                <Clock size={11} /> {countdown}
                              </span>
                            )}
                            {responseCfg && (
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${responseCfg.pill}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${responseCfg.dot}`}
                                />
                                {responseCfg.label}
                              </span>
                            )}
                            {details.rescheduleRequested && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                                <Hourglass size={11} /> Reschedule requested
                              </span>
                            )}
                          </div>

                          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                            {details.title}
                          </h1>
                          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                            <Hash size={13} /> Round {details.round}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={12} />{" "}
                              {formatShortDate(details.scheduledAt)}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock size={12} />{" "}
                              {formatTime(details.scheduledAt)} ·{" "}
                              {formatDuration(details.durationInMinutes)}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1">
                              {isOnline ? (
                                <Video size={12} />
                              ) : (
                                <MapPin size={12} />
                              )}
                              {isOnline
                                ? "Online"
                                : details.location || "In-person"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                        {pendingResponse ? (
                          <button
                            onClick={() => setDecisionModalOpen(true)}
                            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white bg-amber-500 hover:bg-amber-600 active:scale-[0.98] transition-all w-full sm:w-auto justify-center"
                          >
                            <CheckCircle2 size={15} />
                            Respond to invite
                          </button>
                        ) : (
                          isOnline &&
                          details.meetingLink &&
                          !isCancelled && (
                            <button
                              onClick={handleJoin}
                              disabled={!joinable || joining}
                              className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shrink-0 w-full sm:w-auto justify-center ${
                                joinable
                                  ? "text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm shadow-blue-200"
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
                              {isOngoing ? "Join now" : "Join interview"}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {details.candidateJoinedAt && (
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        <UserCheck size={12} /> You joined at{" "}
                        {formatDateTime(details.candidateJoinedAt)}
                      </div>
                    )}
                  </div>
                </div>

                {pendingResponse && (
                  <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 sm:p-6 flex gap-3 items-start">
                    <AlertCircle
                      size={18}
                      className="text-amber-500 shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-amber-700 mb-1">
                        This interview needs your response
                      </h3>
                      <p className="text-sm text-amber-700">
                        Let the recruiter know whether you can make it — they're
                        waiting to hear back before finalizing plans.
                      </p>
                    </div>
                    <button
                      onClick={() => setDecisionModalOpen(true)}
                      className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors"
                    >
                      Respond
                    </button>
                  </div>
                )}

                {details.candidateResponseStatus ===
                  CandidateResponseStatus.DECLINED &&
                  details.candidateResponseMessage && (
                    <div className="bg-red-50 rounded-2xl border border-red-200 p-5 sm:p-6 flex gap-3">
                      <MessageSquare
                        size={18}
                        className="text-red-500 shrink-0 mt-0.5"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-red-700 mb-1">
                          Why you declined
                        </h3>
                        <p className="text-sm text-red-700">
                          {details.candidateResponseMessage}
                        </p>
                      </div>
                    </div>
                  )}

                {details.rescheduleRequested && (
                  <div className="bg-violet-50 rounded-2xl border border-violet-200 p-5 sm:p-6 flex gap-3">
                    <Hourglass
                      size={18}
                      className="text-violet-500 shrink-0 mt-0.5"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-violet-700 mb-1">
                        Reschedule request sent
                      </h3>
                      <p className="text-sm text-violet-700">
                        {details.requestedReason ??
                          "You've asked the recruiter to move this interview."}
                      </p>
                      {details.rescheduleRequestedAt && (
                        <p className="text-xs text-violet-500 mt-1">
                          Requested{" "}
                          {formatDateTime(details.rescheduleRequestedAt)} ·
                          waiting on the recruiter to review
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div className="bg-red-50 rounded-2xl border border-red-200 p-5 sm:p-6 flex gap-3">
                    <XCircle
                      size={18}
                      className="text-red-500 shrink-0 mt-0.5"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-red-700 mb-1">
                        Interview cancelled
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
                  </div>
                )}

                {isNoShow && (
                  <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 sm:p-6 flex gap-3">
                    <AlertCircle
                      size={18}
                      className="text-amber-500 shrink-0 mt-0.5"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-amber-700 mb-1">
                        Marked as no-show
                      </h3>
                      <p className="text-sm text-amber-700">
                        This interview was marked as a no-show. If this doesn't
                        look right, reach out to your recruiter.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                  <div className="lg:col-span-2 space-y-5">
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
                            isOnline ? (
                              <Video size={14} />
                            ) : (
                              <MapPin size={14} />
                            )
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
                        <div className="mt-5 bg-slate-50 rounded-xl border border-slate-200 p-4">
                          <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                            Meeting link
                          </p>
                          <div className="flex items-center gap-2">
                            <a
                              href={details.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all flex-1 min-w-0"
                            >
                              {details.meetingLink}
                            </a>
                            <button
                              onClick={handleCopyLink}
                              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                linkCopied
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {linkCopied ? (
                                <CheckCircle2 size={11} />
                              ) : (
                                <Copy size={11} />
                              )}
                              {linkCopied ? "Copied" : "Copy"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {(details.description || details.notes) && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                        {details.description && (
                          <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <FileText size={13} /> Description
                            </h3>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                              {details.description}
                            </p>
                          </div>
                        )}
                        {details.notes && (
                          <div
                            className={
                              details.description
                                ? "pt-5 border-t border-slate-100"
                                : ""
                            }
                          >
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <StickyNote size={13} /> Notes
                            </h3>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                              {details.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {!details.description && !details.notes && (
                      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                        No description or notes were added for this round.
                      </div>
                    )}
                  </div>

                  <div className="space-y-5 lg:sticky lg:top-20">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                        Quick actions
                      </h3>
                      <div className="space-y-2">
                        {pendingResponse && (
                          <button
                            onClick={() => setDecisionModalOpen(true)}
                            className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors"
                          >
                            <CheckCircle2 size={14} />
                            Respond to invite
                          </button>
                        )}

                        {isOnline &&
                          details.meetingLink &&
                          !isCancelled &&
                          !pendingResponse && (
                            <button
                              onClick={handleJoin}
                              disabled={!joinable || joining}
                              className={`w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all ${
                                joinable
                                  ? "text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm shadow-blue-200"
                                  : "text-slate-400 bg-slate-100 cursor-not-allowed"
                              }`}
                            >
                              {joining ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <ExternalLink size={14} />
                              )}
                              {isOngoing ? "Join now" : "Join interview"}
                            </button>
                          )}

                        {isOnline && details.meetingLink && (
                          <button
                            onClick={handleCopyLink}
                            className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            {linkCopied ? (
                              <CheckCircle2
                                size={14}
                                className="text-emerald-600"
                              />
                            ) : (
                              <Copy size={14} />
                            )}
                            {linkCopied ? "Link copied" : "Copy meeting link"}
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

                        {reschedulable && !pendingResponse && (
                          <button
                            onClick={() => setRescheduleModalOpen(true)}
                            className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors"
                          >
                            <RefreshCw size={14} />
                            Request reschedule
                          </button>
                        )}

                        {details.rescheduleRequested && (
                          <div className="w-full inline-flex items-center justify-center gap-2 text-xs font-medium px-4 py-2.5 rounded-lg bg-violet-50 text-violet-600 border border-violet-100">
                            <Hourglass size={13} />
                            Reschedule request pending
                          </div>
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

                        {!isUpcoming &&
                          !(isOnline && details.meetingLink) &&
                          !details.applicationId &&
                          !reschedulable && (
                            <p className="text-xs text-slate-400 text-center py-1">
                              No actions available for this interview.
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                        At a glance
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <StatTile
                          icon={<Hash size={13} />}
                          label="Round"
                          value={String(details.round)}
                        />
                        <StatTile
                          icon={<Clock size={13} />}
                          label="Duration"
                          value={formatDuration(details.durationInMinutes)}
                        />
                        <StatTile
                          icon={
                            isOnline ? (
                              <Video size={13} />
                            ) : (
                              <MapPin size={13} />
                            )
                          }
                          label="Format"
                          value={isOnline ? "Online" : "In-person"}
                        />
                        <StatTile
                          icon={<BellRing size={13} />}
                          label="Reminder"
                          value={details.reminderSent ? "Sent" : "Pending"}
                          tone={details.reminderSent ? "good" : "neutral"}
                        />
                      </div>
                    </div>

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
                          ...(details.candidateRespondedAt
                            ? [
                                {
                                  label:
                                    details.candidateResponseStatus ===
                                    CandidateResponseStatus.DECLINED
                                      ? "You declined"
                                      : "You accepted",
                                  time: formatDateTime(
                                    details.candidateRespondedAt,
                                  ),
                                  done: true,
                                },
                              ]
                            : []),
                          ...(details.rescheduleRequestedAt
                            ? [
                                {
                                  label: "Reschedule requested",
                                  time: formatDateTime(
                                    details.rescheduleRequestedAt,
                                  ),
                                  done: true,
                                },
                              ]
                            : []),
                          {
                            label: "Reminder sent",
                            done: details.reminderSent,
                          },
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
                                  time: formatDateTime(
                                    details.recruiterJoinedAt,
                                  ),
                                  done: true,
                                },
                              ]
                            : []),
                          ...(details.candidateJoinedAt
                            ? [
                                {
                                  label: "You joined",
                                  time: formatDateTime(
                                    details.candidateJoinedAt,
                                  ),
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

          <footer className="mt-auto bg-white border-t border-slate-200 px-8 py-6 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} RecruitIQ. All rights reserved.</p>
          </footer>
        </div>
      </div>

      {details && (
        <>
          <InterviewDecisionModal
            isOpen={decisionModalOpen}
            onClose={() => setDecisionModalOpen(false)}
            interview={details}
            onAccepted={handleAccepted}
            onRejected={handleRejected}
          />

          <RequestRescheduleModal
            isOpen={rescheduleModalOpen}
            onClose={() => setRescheduleModalOpen(false)}
            interview={details}
            onRequested={handleRescheduleRequested}
          />
        </>
      )}
    </div>
  );
}
