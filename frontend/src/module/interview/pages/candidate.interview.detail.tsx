import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Calendar,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  MapPin,
  ExternalLink,
  ArrowUpRight,
  FileText,
  Hash,
  StickyNote,
  CheckCircle2,
  BellRing,
  RefreshCw,
  Clock,
  Video,
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

import StatTile from "./components/candidate.interview.details/Stattile";
import ActivityTimeline from "./components/candidate.interview.details/Activitytimeline";
import DetailsSkeleton from "./components/candidate.interview.details/Detailsskeleton";
import InterviewHero from "./components/candidate.interview.details/Interviewhero";
import PreparationChecklist from "./components/candidate.interview.details/Preparationchecklist";
import ScheduleSummaryCards from "./components/candidate.interview.details/Schedulesummarycards";
import StatusBanner from "./components/candidate.interview.details/Statusbanner";

import type { MyInterviewDetailsProps } from "./components/candidate.interview.details/Interviewdetails.types";

import {
  formatDateTime,
  formatDuration,
  buildIcsContent,
  ACTIVE_STATUSES,
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
    const interval = setInterval(loadDetails, 60_000);
    return () => clearInterval(interval);
  }, [id]);

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
      loadDetails();
    }
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

  const isCancelled = details?.status === InterviewStatus.CANCELLED;
  const isNoShow = details?.status === InterviewStatus.NO_SHOW;
  const isUpcoming = details ? ACTIVE_STATUSES.includes(details.status) : false;
  const isOnline = details?.mode === InterviewMode.ONLINE;
  const pendingResponse = details ? needsResponse(details) : false;
  const reschedulable = details ? canRequestReschedule(details) : false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <div className="flex flex-1 min-h-0">
        <div className="hidden lg:block sticky top-0 self-start h-screen shrink-0">
             <div className="hidden lg:block">
              <Sidebar />
            </div>
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

          <div className="px-4 sm:px-8 pt-8 pb-6 max-w-5xl w-full mx-auto flex-1">
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

                <InterviewHero
                  details={details}
                  isOnline={isOnline}
                  joining={joining}
                  onJoin={handleJoin}
                />

                <StatusBanner
                  details={details}
                  pendingResponse={pendingResponse}
                  onRespond={() => setDecisionModalOpen(true)}
                />

                {details.candidateResponseStatus ===
                  CandidateResponseStatus.DECLINED &&
                  details.candidateResponseMessage && (
                    <div className="bg-red-50 rounded-2xl border border-red-200 p-5 flex gap-3">
                      <AlertCircle
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

                {isNoShow && (
                  <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 flex gap-3">
                    <AlertCircle
                      size={18}
                      className="text-amber-500 shrink-0 mt-0.5"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-amber-700 mb-1">
                        Marked as no-show
                      </h3>
                      <p className="text-sm text-amber-700">
                        If this doesn't look right, reach out to your recruiter.
                      </p>
                    </div>
                  </div>
                )}

                {isOnline && !isCancelled && <PreparationChecklist />}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                  <div className="lg:col-span-2 space-y-5">
                    <ScheduleSummaryCards
                      details={details}
                      isOnline={isOnline}
                    />

                    {(details.description || details.notes) && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                        {details.description && (
                          <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <FileText size={13} /> What to expect
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
                              <StickyNote size={13} /> Recruiter notes
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

                        {isOnline && !isCancelled && !pendingResponse && (
                          <button
                            onClick={handleJoin}
                            disabled={joining || !!details.candidateJoinedAt}
                            className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-sm shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {joining ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <ExternalLink size={14} />
                            )}
                            {details.candidateJoinedAt
                              ? "Already joined"
                              : "Join interview"}
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
                            className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <RefreshCw size={14} />
                            Request reschedule
                          </button>
                        )}

                        {details.rescheduleRequested && (
                          <div className="w-full inline-flex items-center justify-center gap-2 text-xs font-medium px-4 py-2.5 rounded-lg bg-violet-50 text-violet-600 border border-violet-100">
                            <Clock size={13} />
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
                          !isOnline &&
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
