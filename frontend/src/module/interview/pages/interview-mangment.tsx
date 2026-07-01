'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  Plus,
  MoreVertical,
  ChevronRight,
  BarChart3,
  Search,
  Bell,
  Clock,
  Loader2,
  AlertCircle,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  RefreshCw,
  UserX,
  Play,
  ExternalLink,
  Mail,
  CalendarPlus,
} from 'lucide-react';
import ScheduleInterviewModal from './components/schedule-interview-modal';
import CancelInterviewModal from './components/cancel-interview-modal';
import Sidebar from '@/module/recruiter/pages/components/layout/Sidebar';
import { useRecruiterInterviews } from '../hooks/recruiter/useRecruiterInterviews';
import { useCancelInterview } from '../hooks/recruiter/useCancelInterview';
import type { RecruiterInterviewItem } from '../types/recruiterInterview.types';
import { InterviewStatus } from '../types/interview.types';

const ITEMS_PER_PAGE = 10;

function toInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const CANDIDATE_GRADIENTS = [
  'from-orange-500 to-orange-600',
  'from-purple-500 to-purple-600',
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-cyan-500 to-cyan-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
  'from-teal-500 to-teal-600',
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function candidateGradient(id: string) {
  return CANDIDATE_GRADIENTS[hashString(id) % CANDIDATE_GRADIENTS.length];
}

function formatScheduledAt(scheduledAt?: string): { date: string; time: string } {
  if (!scheduledAt) return { date: '—', time: '—' };
  const d = new Date(scheduledAt);
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return { date, time };
}

function isToday(scheduledAt?: string): boolean {
  if (!scheduledAt) return false;
  return new Date(scheduledAt).toDateString() === new Date().toDateString();
}

// An interview "row" is considered scheduled only when it actually has an
// interviewId + scheduledAt. Rows from applications that haven't been
// scheduled yet will only have applicationId/candidate/job info.
function isInterviewScheduled(interview: RecruiterInterviewItem): boolean {
  return Boolean(interview.interviewId && interview.scheduledAt);
}

function isUpcomingInterview(interview: RecruiterInterviewItem): boolean {
  if (!isInterviewScheduled(interview)) return false;
  if (!interview.scheduledAt) return false;
  const activeStatuses: string[] = [InterviewStatus.SCHEDULED, InterviewStatus.RESCHEDULED];
  return (
    new Date(interview.scheduledAt) > new Date() &&
    activeStatuses.includes(interview.interviewStatus ?? '')
  );
}

// Reschedule / Cancel are only offered while the interview is still
// upcoming and hasn't moved into ongoing/completed/cancelled/no-show.
function canModifyInterview(interview: RecruiterInterviewItem): boolean {
  if (!isInterviewScheduled(interview)) return false;
  const modifiableStatuses: string[] = [InterviewStatus.SCHEDULED, InterviewStatus.RESCHEDULED];
  return modifiableStatuses.includes(interview.interviewStatus ?? '');
}

interface StatusConfig {
  label: string;
  pill: string;
  dot: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  [InterviewStatus.SCHEDULED]: {
    label: 'Scheduled',
    pill: 'bg-blue-50 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
  },
  [InterviewStatus.RESCHEDULED]: {
    label: 'Rescheduled',
    pill: 'bg-violet-50 text-violet-700 border border-violet-200',
    dot: 'bg-violet-500',
  },
  [InterviewStatus.ONGOING]: {
    label: 'Ongoing',
    pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  [InterviewStatus.COMPLETED]: {
    label: 'Completed',
    pill: 'bg-slate-100 text-slate-600 border border-slate-200',
    dot: 'bg-slate-400',
  },
  [InterviewStatus.CANCELLED]: {
    label: 'Cancelled',
    pill: 'bg-red-50 text-red-700 border border-red-200',
    dot: 'bg-red-500',
  },
  [InterviewStatus.NO_SHOW]: {
    label: 'No Show',
    pill: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
  },
};

const NOT_SCHEDULED_CONFIG: StatusConfig = {
  label: 'Not Scheduled',
  pill: 'bg-slate-50 text-slate-500 border border-slate-200 border-dashed',
  dot: 'bg-slate-300',
};

function getStatusConfig(interview: RecruiterInterviewItem): StatusConfig {
  if (!isInterviewScheduled(interview)) return NOT_SCHEDULED_CONFIG;
  return (
    STATUS_CONFIG[interview.interviewStatus ?? ''] ?? {
      label: 'Pending',
      pill: 'bg-slate-50 text-slate-500 border border-slate-200',
      dot: 'bg-slate-300',
    }
  );
}

// Reschedule + Cancel now live as dedicated buttons in the status column, so
// they're intentionally left out of this dropdown to avoid duplication.
const STATUS_TRANSITIONS: Record<string, { status: InterviewStatus; label: string; icon: React.ReactNode }[]> = {
  [InterviewStatus.SCHEDULED]: [
    { status: InterviewStatus.ONGOING, label: 'Mark as Ongoing', icon: <Play size={13} /> },
    { status: InterviewStatus.NO_SHOW, label: 'Mark No-Show', icon: <UserX size={13} /> },
  ],
  [InterviewStatus.RESCHEDULED]: [
    { status: InterviewStatus.ONGOING, label: 'Mark as Ongoing', icon: <Play size={13} /> },
    { status: InterviewStatus.NO_SHOW, label: 'Mark No-Show', icon: <UserX size={13} /> },
  ],
  [InterviewStatus.ONGOING]: [
    { status: InterviewStatus.COMPLETED, label: 'Mark Completed', icon: <CheckCircle2 size={13} /> },
    { status: InterviewStatus.NO_SHOW, label: 'Mark No-Show', icon: <UserX size={13} /> },
  ],
  [InterviewStatus.COMPLETED]: [],
  [InterviewStatus.CANCELLED]: [],
  [InterviewStatus.NO_SHOW]: [],
};

type Tab = 'all' | 'upcoming' | 'today' | 'timeline';

function filterByTab(interviews: RecruiterInterviewItem[], tab: Tab): RecruiterInterviewItem[] {
  const now = new Date();
  switch (tab) {
    case 'upcoming':
      return interviews.filter((i) => i.scheduledAt && new Date(i.scheduledAt) > now);
    case 'today':
      return interviews.filter((i) => isToday(i.scheduledAt));
    default:
      return interviews;
  }
}

function deriveStats(interviews: RecruiterInterviewItem[]) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayCount = interviews.filter((i) => isToday(i.scheduledAt)).length;
  const thisWeek = interviews.filter((i) => i.scheduledAt && new Date(i.scheduledAt) >= weekAgo).length;
  const completedThisMonth = interviews.filter(
    (i) => i.interviewStatus === InterviewStatus.COMPLETED && i.scheduledAt && new Date(i.scheduledAt) >= monthStart,
  ).length;
  const pendingFeedback = interviews.filter((i) => i.interviewStatus === InterviewStatus.COMPLETED).length;

  const upcoming = interviews
    .filter((i) => i.scheduledAt && new Date(i.scheduledAt) > now)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime());

  const nextInterview = upcoming[0]?.scheduledAt
    ? new Date(upcoming[0].scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : null;

  return { todayCount, thisWeek, completedThisMonth, pendingFeedback, nextInterview };
}

// ─── modal state helpers ──────────────────────────────────────────────────────

interface ScheduleModalState {
  open: boolean;
  applicationId?: string;
  // present only when we're rescheduling an existing interview
  interview?: RecruiterInterviewItem;
}

interface CancelModalState {
  open: boolean;
  interview?: RecruiterInterviewItem;
}

// ─── main component ───────────────────────────────────────────────────────────

export default function InterviewDashboard() {
  const [selectedTab, setSelectedTab] = useState<Tab>('all');
  const [currentPage, setCurrentPage] = useState(1);
  // local optimistic status overrides: interviewId → InterviewStatus
  const [statusOverrides, setStatusOverrides] = useState<Record<string, InterviewStatus>>({});

  const [scheduleModal, setScheduleModal] = useState<ScheduleModalState>({ open: false });
  const [cancelModal, setCancelModal] = useState<CancelModalState>({ open: false });

  const { interviews, loading, error, refetch } = useRecruiterInterviews();
  const { submit: submitCancel, loading: cancelLoading, error: cancelError } = useCancelInterview();

  const enriched = useMemo(
    () =>
      interviews.map((i) => ({
        ...i,
        interviewStatus:
          i.interviewId && statusOverrides[i.interviewId] ? statusOverrides[i.interviewId] : i.interviewStatus,
      })),
    [interviews, statusOverrides],
  );

  const filtered = useMemo(() => filterByTab(enriched, selectedTab), [enriched, selectedTab]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const stats = useMemo(() => deriveStats(enriched), [enriched]);

  function handleTabChange(tab: Tab) {
    setSelectedTab(tab);
    setCurrentPage(1);
  }

  function handleStatusChange(interviewId: string, newStatus: InterviewStatus) {
    setStatusOverrides((prev) => ({ ...prev, [interviewId]: newStatus }));
    // TODO: call your API here → updateInterviewStatus(interviewId, newStatus)
  }

  // Opens the schedule modal for a brand-new interview (no interview exists yet).
  // We pass the *whole* row (not just applicationId) so the modal can show
  // candidate/application context immediately.
  function openScheduleForApplication(interview: RecruiterInterviewItem) {
    setScheduleModal({ open: true, applicationId: interview.applicationId, interview });
  }

  // Opens the same modal but in "reschedule" mode, pre-scoped to the interview.
  function openReschedule(interview: RecruiterInterviewItem) {
    setScheduleModal({ open: true, applicationId: interview.applicationId, interview });
  }

  function closeScheduleModal() {
    setScheduleModal({ open: false });
  }

  function openCancel(interview: RecruiterInterviewItem) {
    setCancelModal({ open: true, interview });
  }

  function closeCancelModal() {
    if (cancelLoading) return;
    setCancelModal({ open: false });
  }

  async function handleConfirmCancel(reason: string) {
    const interview = cancelModal.interview;
    if (!interview?.interviewId) return;

    const result = await submitCancel(interview.interviewId, { reason });
    if (result) {
      setStatusOverrides((prev) => ({ ...prev, [interview.interviewId!]: InterviewStatus.CANCELLED }));
      setCancelModal({ open: false });
      refetch();
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="px-8 py-5">
            <div className="flex items-center justify-between gap-6 mb-4">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-0.5">RecruitIQ</p>
                <h1 className="text-2xl font-bold text-slate-900">Interviews</h1>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                  <Search size={17} />
                </button>
                <button className="p-2.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors relative">
                  <Bell size={17} />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white" />
                </button>
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <TabButton
                  icon={BarChart3}
                  label="Timeline"
                  active={selectedTab === 'timeline'}
                  onClick={() => handleTabChange('timeline')}
                />
                <TabButton label="All" active={selectedTab === 'all'} onClick={() => handleTabChange('all')} count={enriched.length} />
                <TabButton
                  label="Upcoming"
                  active={selectedTab === 'upcoming'}
                  onClick={() => handleTabChange('upcoming')}
                  count={enriched.filter((i) => i.scheduledAt && new Date(i.scheduledAt) > new Date()).length}
                />
                <TabButton label="Today" active={selectedTab === 'today'} onClick={() => handleTabChange('today')} count={stats.todayCount} />
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                  <Calendar size={15} />
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' })}
                </button>
                <button
                  onClick={() => setScheduleModal({ open: true })}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold text-sm transition-colors shadow-sm shadow-blue-200"
                >
                  <Plus size={15} />
                  Schedule Interview
                </button>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-3">
              <StatCard
                label="Today's Interviews"
                value={String(stats.todayCount)}
                sub={stats.nextInterview ? `Next at ${stats.nextInterview}` : 'None scheduled today'}
                accent="blue"
              />
              <StatCard label="This Week" value={String(stats.thisWeek)} sub="Across all rounds" accent="violet" chart />
              <StatCard label="Completed This Month" value={String(stats.completedThisMonth)} sub="75% success rate" accent="emerald" />
              <StatCard label="Pending Feedback" value={String(stats.pendingFeedback)} sub="Awaiting review" accent="amber" />
            </div>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {loading && (
              <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                <Loader2 size={20} className="animate-spin text-blue-500" />
                <span className="text-sm font-medium">Loading interviews…</span>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-red-500">
                <AlertCircle size={28} />
                <p className="text-sm font-semibold">{error}</p>
                <button
                  onClick={refetch}
                  className="text-xs px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600 font-medium"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-2 text-slate-400">
                <Calendar size={36} className="text-slate-200" />
                <p className="text-sm font-semibold text-slate-500 mt-2">No interviews found</p>
                <p className="text-xs text-slate-400">
                  {selectedTab !== 'all' ? 'Switch to "All" to see everything.' : 'Schedule your first interview to get started.'}
                </p>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80">
                        {['Date & Time', 'Candidate', 'Position', 'Round', 'Mode', 'Status', 'Meeting', 'Actions'].map((col) => (
                          <th key={col} className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginated.map((interview) => (
                        <InterviewRow
                          key={interview.interviewId ?? interview.applicationId}
                          interview={interview}
                          onStatusChange={handleStatusChange}
                          onOpenSchedule={openScheduleForApplication}
                          onOpenReschedule={openReschedule}
                          onOpenCancel={openCancel}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-xs text-slate-500">
                      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{' '}
                      {filtered.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <PageBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        <ChevronLeft size={14} />
                      </PageBtn>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors ${
                            p === currentPage ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <PageBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                        <ChevronRight size={14} />
                      </PageBtn>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/*
        ScheduleInterviewModal auto-detects schedule vs. reschedule from
        `interview` — reschedule mode only kicks in once interviewId +
        scheduledAt are present on that row.
      */}
  <ScheduleInterviewModal
  isOpen={scheduleModal.open}
  onClose={closeScheduleModal}
  interview={scheduleModal.interview}
  applicationId={scheduleModal.applicationId}
  onSuccess={() => { closeScheduleModal(); refetch(); }}
/>

      <CancelInterviewModal
        isOpen={cancelModal.open}
        onClose={closeCancelModal}
        onConfirm={handleConfirmCancel}
        loading={cancelLoading}
        error={cancelError}
        candidateName={cancelModal.interview?.candidateName}
      />
    </div>
  );
}

// ─── Interview Row ────────────────────────────────────────────────────────────

function InterviewRow({
  interview,
  onStatusChange,
  onOpenSchedule,
  onOpenReschedule,
  onOpenCancel,
}: {
  interview: RecruiterInterviewItem;
  onStatusChange: (id: string, status: InterviewStatus) => void;
  onOpenSchedule: (interview: RecruiterInterviewItem) => void;
  onOpenReschedule: (interview: RecruiterInterviewItem) => void;
  onOpenCancel: (interview: RecruiterInterviewItem) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { date, time } = formatScheduledAt(interview.scheduledAt);
  const gradient = candidateGradient(interview.candidateId);
  const scheduled = isInterviewScheduled(interview);
  const upcoming = isUpcomingInterview(interview);
  const modifiable = canModifyInterview(interview);
  const statusCfg = getStatusConfig(interview);
  const transitions = STATUS_TRANSITIONS[interview.interviewStatus ?? ''] ?? [];
  const todayFlag = isToday(interview.scheduledAt);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen]);

  const name = interview.candidateName || interview.candidateId;
  const initials = toInitials(name);
  const jobTitle = interview.jobTitle || interview.jobId;
  function handleRowClick() {
    if (!scheduled) onOpenSchedule(interview);
  }

  return (
    <tr
      onClick={handleRowClick}
      className={`transition-colors group ${
        scheduled ? 'hover:bg-blue-50/20' : 'hover:bg-blue-50/40 cursor-pointer'
      }`}
      title={!scheduled ? 'Click to schedule this interview' : undefined}
    >
      {/* Date & Time */}
      <td className="px-5 py-3.5">
        {scheduled ? (
          <div className="flex items-start gap-2">
            {todayFlag && <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 ring-2 ring-blue-100" />}
            <div>
              <div className="text-sm font-semibold text-slate-800">{date}</div>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <Clock size={11} />
                {time}
                {interview.durationInMinutes && <span className="text-slate-300">· {interview.durationInMinutes}m</span>}
              </div>
              {todayFlag && <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Today</span>}
            </div>
          </div>
        ) : (
          <span className="text-sm text-slate-300">—</span>
        )}
      </td>

      {/* Candidate */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          {interview.candidateProfileImage ? (
            <img src={interview.candidateProfileImage} alt={name} className="w-9 h-9 rounded-lg object-cover shadow-sm flex-shrink-0" />
          ) : (
            <div
              className={`w-9 h-9 bg-linear-to-br ${gradient} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0`}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">{name}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1 truncate">
              <Mail size={10} />
              {interview.candidateEmail || '—'}
            </div>
          </div>
        </div>
      </td>

      {/* Job Title */}
      <td className="px-5 py-3.5">
        <div className="text-sm font-medium text-slate-700 truncate max-w-[180px]">{jobTitle}</div>
        {interview.title && <div className="text-xs text-slate-400 truncate max-w-[180px] mt-0.5">{interview.title}</div>}
      </td>

      {/* Round */}
      <td className="px-5 py-3.5">
        {interview.round != null ? (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
            {interview.round}
          </span>
        ) : (
          <span className="text-slate-300 text-sm">—</span>
        )}
      </td>

      {/* Mode */}
      <td className="px-5 py-3.5">
        {interview.meetingLink ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            <Video size={11} /> Online
          </span>
        ) : interview.location ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
            <MapPin size={11} /> {interview.location}
          </span>
        ) : (
          <span className="text-slate-300 text-xs">—</span>
        )}
      </td>

      {/* Status */}
      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
        {!scheduled ? (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>
            <button
              onClick={() => onOpenSchedule(interview)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
            >
              <CalendarPlus size={11} /> Schedule
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
              {upcoming && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600 uppercase tracking-wide">
                  Upcoming
                </span>
              )}
            </div>
            {modifiable && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenReschedule(interview)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-2 py-1 rounded-md transition-colors"
                >
                  <RefreshCw size={10} /> Reschedule
                </button>
                <button
                  onClick={() => onOpenCancel(interview)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition-colors"
                >
                  <XCircle size={10} /> Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </td>

      {/* Meeting */}
      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
        {interview.meetingLink && interview.meetingLink !== 'N/A' ? (
          <a
            href={interview.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
          >
            Join <ExternalLink size={10} />
          </a>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
        {scheduled ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all"
            >
              <MoreVertical size={15} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-50 w-52 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/80 overflow-hidden">
                {transitions.length > 0 ? (
                  <>
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Status</p>
                    </div>
                    {transitions.map((t) => {
                      const cfg = STATUS_CONFIG[t.status];
                      return (
                        <button
                          key={t.status}
                          onClick={() => {
                            if (interview.interviewId) onStatusChange(interview.interviewId, t.status);
                            setMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          <span
                            className={`flex-shrink-0 w-5 h-5 rounded-full ${cfg.dot} bg-opacity-20 flex items-center justify-center text-white`}
                          >
                            {t.icon}
                          </span>
                          <span className="font-medium">{t.label}</span>
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <div className="px-3 py-3 text-xs text-slate-400 text-center">No actions available</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        )}
      </td>
    </tr>
  );
}

// ─── sub-components ───────────────────────────────────────────────────────────

function TabButton({
  icon: Icon,
  label,
  active,
  onClick,
  count,
}: {
  icon?: React.ComponentType<{ size: number }>;
  label?: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium text-xs transition-colors ${
        active ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {Icon && <Icon size={13} />}
      {label}
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
  chart,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: 'blue' | 'violet' | 'emerald' | 'amber';
  chart?: boolean;
}) {
  const accentMap = {
    blue: { bar: 'bg-blue-500', num: 'text-blue-600' },
    violet: { bar: 'bg-violet-500', num: 'text-violet-600' },
    emerald: { bar: 'bg-emerald-500', num: 'text-emerald-600' },
    amber: { bar: 'bg-amber-500', num: 'text-amber-600' },
  };
  const { bar, num } = accentMap[accent];

  return (
    <div className="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2 truncate">{label}</p>
      <div className={`text-2xl font-bold ${num} mb-1`}>{value}</div>
      {chart && (
        <div className="flex items-end gap-0.5 h-6 mb-1">
          {[2, 1.5, 3, 1.5, 2.5, 2, 3.5].map((h, i) => (
            <div key={i} className={`flex-1 ${bar} rounded-sm opacity-70`} style={{ height: `${h * 6}px` }} />
          ))}
        </div>
      )}
      {sub && <p className="text-[11px] text-slate-400 truncate">{sub}</p>}
    </div>
  );
}

function PageBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}