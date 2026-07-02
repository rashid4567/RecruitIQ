'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
  Circle,
  Hourglass,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import { useCandidateInterviewDetails } from '../hooks/candidate/useCandidateInterviewDetails';
import { useJoinInterview } from '../hooks/candidate/useJoinInterview';
import type { GetCandidateInterviewDetailsResponse } from '../types/candidateInterview.types';
import { InterviewMode, InterviewStatus, CandidateResponseStatus } from '../types/interview.types';
import Sidebar from "../../candidate/pages/components/personalInfo/shared/candidateSidebar";
import Header from "@/pages/landing/sections/Header";
import InterviewDecisionModal from './components/interview-decision-modal';
import RequestRescheduleModal from './components/request-reschedule-modal';


export interface MyInterviewDetailsProps {
  id?: string;
  onBack?: () => void;
}


function formatDateLabel(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatShortDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDateTime(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDuration(minutes?: number): string {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

function escapeIcs(text: string): string {
  return text.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');
}

function toIcsTimestamp(d: Date): string {
  return `${d.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

function buildIcsContent(details: GetCandidateInterviewDetailsResponse): string {
  const start = new Date(details.scheduledAt);
  const end = new Date(start.getTime() + details.durationInMinutes * 60000);
  const locationOrLink = details.mode === InterviewMode.ONLINE ? details.meetingLink ?? '' : details.location ?? '';
  const descriptionParts = [
    details.description ?? '',
    details.mode === InterviewMode.ONLINE && details.meetingLink ? `Meeting link: ${details.meetingLink}` : '',
  ].filter(Boolean);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RecruitIQ//Interview//EN',
    'BEGIN:VEVENT',
    `UID:${details.id}@recruitiq`,
    `DTSTAMP:${toIcsTimestamp(new Date())}`,
    `DTSTART:${toIcsTimestamp(start)}`,
    `DTEND:${toIcsTimestamp(end)}`,
    `SUMMARY:${escapeIcs(details.title)}`,
    descriptionParts.length ? `DESCRIPTION:${escapeIcs(descriptionParts.join('\n'))}` : '',
    locationOrLink ? `LOCATION:${escapeIcs(locationOrLink)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.filter(Boolean).join('\r\n');
}


interface StatusConfig {
  label: string;
  pill: string;
  dot: string;
  ring: string;
  icon: React.ReactNode;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  [InterviewStatus.SCHEDULED]: {
    label: 'Scheduled',
    pill: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    dot: 'bg-indigo-500',
    ring: 'ring-indigo-100',
    icon: <Calendar size={12} />,
  },
  [InterviewStatus.RESCHEDULED]: {
    label: 'Rescheduled',
    pill: 'bg-violet-50 text-violet-700 border border-violet-200',
    dot: 'bg-violet-500',
    ring: 'ring-violet-100',
    icon: <Calendar size={12} />,
  },
  [InterviewStatus.ONGOING]: {
    label: 'Live now',
    pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-100',
    icon: <Circle size={10} />,
  },
  [InterviewStatus.COMPLETED]: {
    label: 'Completed',
    pill: 'bg-slate-100 text-slate-600 border border-slate-200',
    dot: 'bg-slate-400',
    ring: 'ring-slate-100',
    icon: <CheckCircle2 size={12} />,
  },
  [InterviewStatus.CANCELLED]: {
    label: 'Cancelled',
    pill: 'bg-red-50 text-red-700 border border-red-200',
    dot: 'bg-red-500',
    ring: 'ring-red-100',
    icon: <XCircle size={12} />,
  },
  [InterviewStatus.NO_SHOW]: {
    label: 'No show',
    pill: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
    ring: 'ring-amber-100',
    icon: <AlertCircle size={12} />,
  },
};

function getStatusConfig(status?: InterviewStatus): StatusConfig {
  return (
    STATUS_CONFIG[status ?? ''] ?? {
      label: 'Pending',
      pill: 'bg-slate-50 text-slate-500 border border-slate-200',
      dot: 'bg-slate-300',
      ring: 'ring-slate-100',
      icon: <Circle size={10} />,
    }
  );
}

// Candidate's own response to the invite — separate from the interview's
// lifecycle status above.
const RESPONSE_CONFIG: Record<string, { label: string; pill: string; dot: string }> = {
  [CandidateResponseStatus.PENDING]: {
    label: 'Awaiting your response',
    pill: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
  },
  [CandidateResponseStatus.ACCEPTED]: {
    label: 'You accepted',
    pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  [CandidateResponseStatus.DECLINED]: {
    label: 'You declined',
    pill: 'bg-red-50 text-red-700 border border-red-200',
    dot: 'bg-red-500',
  },
};

function getResponseConfig(status?: string) {
  return RESPONSE_CONFIG[status ?? ''] ?? null;
}

const ACTIVE_STATUSES: string[] = [InterviewStatus.SCHEDULED, InterviewStatus.RESCHEDULED, InterviewStatus.ONGOING];
const MODIFIABLE_STATUSES: string[] = [InterviewStatus.SCHEDULED, InterviewStatus.RESCHEDULED];
const JOINABLE_WINDOW_MS = 15 * 60 * 1000;

function canJoinNow(details: GetCandidateInterviewDetailsResponse, now: number): boolean {
  if (details.mode !== InterviewMode.ONLINE || !details.meetingLink) return false;
  if (details.status === InterviewStatus.ONGOING) return true;
  if (!ACTIVE_STATUSES.includes(details.status)) return false;
  const start = new Date(details.scheduledAt).getTime();
  const duration = details.durationInMinutes * 60 * 1000;
  return now >= start - JOINABLE_WINDOW_MS && now <= start + duration;
}

function getCountdownLabel(details: GetCandidateInterviewDetailsResponse, now: number): string | null {
  if (!ACTIVE_STATUSES.includes(details.status)) return null;
  if (details.status === InterviewStatus.ONGOING) return 'Live now';

  const start = new Date(details.scheduledAt).getTime();
  const diffMs = start - now;

  if (diffMs <= 0) {
    const end = start + details.durationInMinutes * 60 * 1000;
    return now <= end ? 'In progress' : null;
  }

  const totalMinutes = Math.round(diffMs / 60000);
  if (totalMinutes < 1) return 'Starting now';
  if (totalMinutes < 60) return `Starts in ${totalMinutes}m`;

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours < 24) return `Starts in ${hours}h${mins ? ` ${mins}m` : ''}`;

  const days = Math.floor(hours / 24);
  return `Starts in ${days}d`;
}

// A response is needed while the interview is still active and the
// candidate hasn't accepted/declined yet.
function needsResponse(details: GetCandidateInterviewDetailsResponse): boolean {
  return ACTIVE_STATUSES.includes(details.status) && details.candidateResponseStatus === CandidateResponseStatus.PENDING;
}

// Prefer the server's own `canReschedule` flag when present; fall back to
// inferring it from status + whether a request is already open.
function canRequestReschedule(details: GetCandidateInterviewDetailsResponse): boolean {
  if (typeof details.canReschedule === 'boolean') return details.canReschedule;
  if (details.rescheduleRequested) return false;
  return MODIFIABLE_STATUSES.includes(details.status);
}


export default function MyInterviewDetails({ id: idProp, onBack }: MyInterviewDetailsProps) {
  const { interviewId: idParam } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const id = idProp ?? idParam ?? '';

  const [details, setDetails] = useState<GetCandidateInterviewDetailsResponse | null>(null);
  const [joining, setJoining] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);

  const { getDetails, loading, error } = useCandidateInterviewDetails();
  const { submit: submitJoin, error: joinError, setError: setJoinError } = useJoinInterview();

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
      setDetails((prev) => (prev ? { ...prev, candidateJoinedAt: result.candidateJoinedAt, status: result.status } : prev));
      if (details.meetingLink) window.open(details.meetingLink, '_blank', 'noopener,noreferrer');
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
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${details.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'interview'}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleAccepted() {
    setDetails((prev) => (prev ? { ...prev, candidateResponseStatus: CandidateResponseStatus.ACCEPTED } : prev));
    setDecisionModalOpen(false);
    loadDetails();
  }

  function handleRejected() {
    setDetails((prev) => (prev ? { ...prev, candidateResponseStatus: CandidateResponseStatus.DECLINED } : prev));
    setDecisionModalOpen(false);
    loadDetails();
  }

  function handleRescheduleRequested() {
    setDetails((prev) => (prev ? { ...prev, rescheduleRequested: true } : prev));
    setRescheduleModalOpen(false);
    loadDetails();
  }

  const statusCfg = getStatusConfig(details?.status);
  const responseCfg = details ? getResponseConfig(details.candidateResponseStatus) : null;
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

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col bg-linear-to-b from-slate-50 to-slate-100">
         <div className="sticky top-16 z-20 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200/70">
            <nav className="flex items-center gap-1.5 text-sm px-4 sm:px-8 py-3.5 max-w-5xl w-full mx-auto">
              <button
                onClick={handleBack}
                aria-label="Go back"
                className="flex items-center justify-center w-7 h-7 -ml-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors flex-shrink-0"
              >
                <ChevronLeft size={16} />
              </button>
              <button onClick={handleBack} className="text-slate-500 hover:text-slate-800 font-medium transition-colors">
                Interviews
              </button>
              <ChevronRight size={13} className="text-slate-300 flex-shrink-0" />
              <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-sm">
                {details?.title ?? (loading ? 'Loading…' : 'Details')}
              </span>
            </nav>
          </div>

       <div className="px-4 sm:px-8 pt-12 pb-6 max-w-5xl w-full mx-auto flex-1">
            {/* Loading skeleton */}
            {loading && !details && <DetailsSkeleton />}

            {/* Error */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle size={22} className="text-red-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700">{error}</p>
                <p className="text-xs text-slate-400">Something went wrong while loading this interview.</p>
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
                <p className="text-sm font-semibold text-slate-600 mt-1">Interview not found</p>
                <p className="text-xs text-slate-400">It may have been removed, or the link is incorrect.</p>
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
                    <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{joinError}</p>
                  </div>
                )}

                {/* ── Hero card ── */}
                <div className="mt-8 relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  {isOngoing && <span className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />}
                  <div className="p-6 sm:p-7">
                    <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap justify-between">
                      <div className="flex items-start gap-4 min-w-0">
                        {/* Mode badge */}
                        <div
                          className={`hidden sm:flex w-12 h-12 rounded-xl items-center justify-center flex-shrink-0 ${
                            isOnline ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isOnline ? <Video size={20} /> : <MapPin size={20} />}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.pill}`}>
                              {isOngoing ? <PulseDot /> : statusCfg.icon}
                              {statusCfg.label}
                            </span>
                            {countdown && !isOngoing && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                <Clock size={11} /> {countdown}
                              </span>
                            )}
                            {responseCfg && (
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${responseCfg.pill}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${responseCfg.dot}`} />
                                {responseCfg.label}
                              </span>
                            )}
                            {details.rescheduleRequested && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                                <Hourglass size={11} /> Reschedule requested
                              </span>
                            )}
                          </div>

                          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">{details.title}</h1>
                          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                            <Hash size={13} /> Round {details.round}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={12} /> {formatShortDate(details.scheduledAt)}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock size={12} /> {formatTime(details.scheduledAt)} · {formatDuration(details.durationInMinutes)}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1">
                              {isOnline ? <Video size={12} /> : <MapPin size={12} />}
                              {isOnline ? 'Online' : details.location || 'In-person'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
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
                              className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all flex-shrink-0 w-full sm:w-auto justify-center ${
                                joinable
                                  ? 'text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm shadow-blue-200'
                                  : 'text-slate-400 bg-slate-100 cursor-not-allowed'
                              }`}
                              title={joinable ? 'Join the interview' : 'Join link opens 15 minutes before start'}
                            >
                              {joining ? <Loader2 size={15} className="animate-spin" /> : <ExternalLink size={15} />}
                              {isOngoing ? 'Join now' : 'Join interview'}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {details.candidateJoinedAt && (
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        <UserCheck size={12} /> You joined at {formatDateTime(details.candidateJoinedAt)}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Response needed banner ── */}
                {pendingResponse && (
                  <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 sm:p-6 flex gap-3 items-start">
                    <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-amber-700 mb-1">This interview needs your response</h3>
                      <p className="text-sm text-amber-700">
                        Let the recruiter know whether you can make it — they're waiting to hear back before finalizing plans.
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

                {/* ── Declined reason (if you declined) ── */}
                {details.candidateResponseStatus === CandidateResponseStatus.DECLINED && details.candidateResponseMessage && (
                  <div className="bg-red-50 rounded-2xl border border-red-200 p-5 sm:p-6 flex gap-3">
                    <MessageSquare size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-red-700 mb-1">Why you declined</h3>
                      <p className="text-sm text-red-700">{details.candidateResponseMessage}</p>
                    </div>
                  </div>
                )}

                {/* ── Reschedule request banner ── */}
                {details.rescheduleRequested && (
                  <div className="bg-violet-50 rounded-2xl border border-violet-200 p-5 sm:p-6 flex gap-3">
                    <Hourglass size={18} className="text-violet-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-violet-700 mb-1">Reschedule request sent</h3>
                      <p className="text-sm text-violet-700">
                        {details.requestedReason ?? "You've asked the recruiter to move this interview."}
                      </p>
                      {details.rescheduleRequestedAt && (
                        <p className="text-xs text-violet-500 mt-1">
                          Requested {formatDateTime(details.rescheduleRequestedAt)} · waiting on the recruiter to review
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Cancellation / no-show banners ── */}
                {isCancelled && (
                  <div className="bg-red-50 rounded-2xl border border-red-200 p-5 sm:p-6 flex gap-3">
                    <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-red-700 mb-1">Interview cancelled</h3>
                      {details.cancelledReason && <p className="text-sm text-red-700">{details.cancelledReason}</p>}
                      {details.cancelledBy && <p className="text-xs text-red-500 mt-1">Cancelled by {details.cancelledBy}</p>}
                    </div>
                  </div>
                )}

                {isNoShow && (
                  <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 sm:p-6 flex gap-3">
                    <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-amber-700 mb-1">Marked as no-show</h3>
                      <p className="text-sm text-amber-700">
                        This interview was marked as a no-show. If this doesn't look right, reach out to your recruiter.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Body grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                  {/* Main column */}
                  <div className="lg:col-span-2 space-y-5">
                    {/* Schedule details */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Schedule</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailRow icon={<Calendar size={14} />} label="Date" value={formatDateLabel(details.scheduledAt)} />
                        <DetailRow icon={<Clock size={14} />} label="Time" value={formatTime(details.scheduledAt)} />
                        <DetailRow icon={<Clock size={14} />} label="Duration" value={formatDuration(details.durationInMinutes)} />
                        <DetailRow
                          icon={isOnline ? <Video size={14} /> : <MapPin size={14} />}
                          label="Format"
                          value={isOnline ? 'Online' : 'In-person'}
                        />
                        {!isOnline && details.location && <DetailRow icon={<MapPin size={14} />} label="Location" value={details.location} />}
                        {!isOnline && details.roomId && <DetailRow icon={<Building2 size={14} />} label="Room" value={details.roomId} />}
                      </div>

                      {isOnline && details.meetingLink && (
                        <div className="mt-5 bg-slate-50 rounded-xl border border-slate-200 p-4">
                          <p className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Meeting link</p>
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
                              className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                linkCopied ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {linkCopied ? <CheckCircle2 size={11} /> : <Copy size={11} />}
                              {linkCopied ? 'Copied' : 'Copy'}
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
                            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{details.description}</p>
                          </div>
                        )}
                        {details.notes && (
                          <div className={details.description ? 'pt-5 border-t border-slate-100' : ''}>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <StickyNote size={13} /> Notes
                            </h3>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{details.notes}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Empty state for main column when nothing else to show */}
                    {!details.description && !details.notes && (
                      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                        No description or notes were added for this round.
                      </div>
                    )}
                  </div>

                  {/* Sidebar column */}
                  <div className="space-y-5 lg:sticky lg:top-20">
                    {/* Quick actions */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Quick actions</h3>
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

                        {isOnline && details.meetingLink && !isCancelled && !pendingResponse && (
                          <button
                            onClick={handleJoin}
                            disabled={!joinable || joining}
                            className={`w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all ${
                              joinable
                                ? 'text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm shadow-blue-200'
                                : 'text-slate-400 bg-slate-100 cursor-not-allowed'
                            }`}
                          >
                            {joining ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                            {isOngoing ? 'Join now' : 'Join interview'}
                          </button>
                        )}

                        {isOnline && details.meetingLink && (
                          <button
                            onClick={handleCopyLink}
                            className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            {linkCopied ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                            {linkCopied ? 'Link copied' : 'Copy meeting link'}
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

                        {!isUpcoming && !(isOnline && details.meetingLink) && !details.applicationId && !reschedulable && (
                          <p className="text-xs text-slate-400 text-center py-1">No actions available for this interview.</p>
                        )}
                      </div>
                    </div>

                    {/* At a glance */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">At a glance</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <StatTile icon={<Hash size={13} />} label="Round" value={String(details.round)} />
                        <StatTile icon={<Clock size={13} />} label="Duration" value={formatDuration(details.durationInMinutes)} />
                        <StatTile icon={isOnline ? <Video size={13} /> : <MapPin size={13} />} label="Format" value={isOnline ? 'Online' : 'In-person'} />
                        <StatTile
                          icon={<BellRing size={13} />}
                          label="Reminder"
                          value={details.reminderSent ? 'Sent' : 'Pending'}
                          tone={details.reminderSent ? 'good' : 'neutral'}
                        />
                      </div>
                    </div>

                    {/* Activity timeline */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Activity</h3>
                      <ActivityTimeline
                        items={[
                          { label: 'Interview scheduled', time: formatDateTime(details.createdAt), done: true, muted: true },
                          ...(details.candidateRespondedAt
                            ? [
                                {
                                  label:
                                    details.candidateResponseStatus === CandidateResponseStatus.DECLINED
                                      ? 'You declined'
                                      : 'You accepted',
                                  time: formatDateTime(details.candidateRespondedAt),
                                  done: true,
                                },
                              ]
                            : []),
                          ...(details.rescheduleRequestedAt
                            ? [{ label: 'Reschedule requested', time: formatDateTime(details.rescheduleRequestedAt), done: true }]
                            : []),
                          { label: 'Reminder sent', done: details.reminderSent },
                          ...(details.startedAt ? [{ label: 'Interview started', time: formatDateTime(details.startedAt), done: true }] : []),
                          ...(details.recruiterJoinedAt
                            ? [{ label: 'Recruiter joined', time: formatDateTime(details.recruiterJoinedAt), done: true }]
                            : []),
                          ...(details.candidateJoinedAt
                            ? [{ label: 'You joined', time: formatDateTime(details.candidateJoinedAt), done: true }]
                            : []),
                          ...(details.endedAt ? [{ label: 'Interview ended', time: formatDateTime(details.endedAt), done: true }] : []),
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

// ─── sub-components ─────────────────────────────────────────────────────────────

function PulseDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
    </span>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

function StatTile({
  icon,
  label,
  value,
  tone = 'neutral',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: 'good' | 'neutral';
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
      <span className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
        {icon}
        {label}
      </span>
      <span className={`text-sm font-bold ${tone === 'good' ? 'text-emerald-600' : 'text-slate-800'}`}>{value}</span>
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
            <span className={`absolute left-[6.5px] top-4 bottom-0 w-px ${item.done ? 'bg-emerald-200' : 'bg-slate-200'}`} />
          )}
          <span
            className={`mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center ${
              item.done ? (item.muted ? 'bg-slate-300' : 'bg-emerald-500') : 'border-2 border-slate-200 bg-white'
            }`}
          >
            {item.done && <CheckCircle2 size={9} className="text-white" strokeWidth={3} />}
          </span>
          <div className="min-w-0 -mt-0.5">
            <p className={`text-xs ${item.done ? (item.muted ? 'text-slate-400' : 'text-slate-700 font-medium') : 'text-slate-400'}`}>{item.label}</p>
            {item.time && item.time !== '—' && <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>}
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