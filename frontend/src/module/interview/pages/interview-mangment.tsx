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
  UserX,
  Play,
  History,
  X,
  CalendarClock,
  SlidersHorizontal,
} from 'lucide-react';
import ScheduleInterviewModal from './components/schedule-interview-modal';
import CancelInterviewModal from './components/cancel-interview-modal';
import Sidebar from '@/module/recruiter/pages/components/layout/Sidebar';
import { useRecruiterInterviews } from '../hooks/recruiter/useRecruiterInterviews';
import { useCancelInterview } from '../hooks/recruiter/useCancelInterview';
import { useApproveRescheduleRequest } from '../hooks/recruiter/useApproveRescheduleRequest';
import { useRejectRescheduleRequest } from '../hooks/recruiter/useRejectRescheduleRequest';
import type { RecruiterInterviewItem } from '../types/recruiterInterview.types';
import { InterviewStatus } from '../types/interview.types';

const ITEMS_PER_PAGE = 8;
const SEARCH_DEBOUNCE_MS = 300;

function toInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
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

function formatFullDateTime(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isToday(scheduledAt?: string): boolean {
  if (!scheduledAt) return false;
  return new Date(scheduledAt).toDateString() === new Date().toDateString();
}

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

function canModifyInterview(interview: RecruiterInterviewItem): boolean {
  if (!isInterviewScheduled(interview)) return false;
  const modifiableStatuses: string[] = [InterviewStatus.SCHEDULED, InterviewStatus.RESCHEDULED];
  return modifiableStatuses.includes(interview.interviewStatus ?? '');
}

function hasPendingRescheduleRequest(interview: RecruiterInterviewItem): boolean {
  return Boolean(interview.rescheduleRequested) && canModifyInterview(interview);
}

interface StatusConfig {
  label: string;
  pill: string;
  dot: string;
  bgIcon: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  [InterviewStatus.SCHEDULED]: {
    label: 'Scheduled',
    pill: 'bg-blue-50 text-blue-700 border border-blue-200',
    bgIcon: 'bg-blue-100',
    dot: 'bg-blue-500',
  },
  [InterviewStatus.RESCHEDULED]: {
    label: 'Rescheduled',
    pill: 'bg-violet-50 text-violet-700 border border-violet-200',
    bgIcon: 'bg-violet-100',
    dot: 'bg-violet-500',
  },
  [InterviewStatus.ONGOING]: {
    label: 'Ongoing',
    pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    bgIcon: 'bg-emerald-100',
    dot: 'bg-emerald-500',
  },
  [InterviewStatus.COMPLETED]: {
    label: 'Completed',
    pill: 'bg-slate-100 text-slate-600 border border-slate-200',
    bgIcon: 'bg-slate-100',
    dot: 'bg-slate-400',
  },
  [InterviewStatus.CANCELLED]: {
    label: 'Cancelled',
    pill: 'bg-red-50 text-red-700 border border-red-200',
    bgIcon: 'bg-red-100',
    dot: 'bg-red-500',
  },
  [InterviewStatus.NO_SHOW]: {
    label: 'No Show',
    pill: 'bg-amber-50 text-amber-700 border border-amber-200',
    bgIcon: 'bg-amber-100',
    dot: 'bg-amber-500',
  },
};

const NOT_SCHEDULED_CONFIG: StatusConfig = {
  label: 'Not Scheduled',
  pill: 'bg-slate-50 text-slate-500 border border-slate-200 border-dashed',
  bgIcon: 'bg-slate-100',
  dot: 'bg-slate-300',
};

function getStatusConfig(interview: RecruiterInterviewItem): StatusConfig {
  if (!isInterviewScheduled(interview)) return NOT_SCHEDULED_CONFIG;
  return (
    STATUS_CONFIG[interview.interviewStatus ?? ''] ?? {
      label: 'Pending',
      pill: 'bg-slate-50 text-slate-500 border border-slate-200',
      bgIcon: 'bg-slate-100',
      dot: 'bg-slate-300',
    }
  );
}

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

type Tab = 'all' | 'upcoming' | 'today' | 'timeline' | 'reschedule';

function filterByTab(interviews: RecruiterInterviewItem[], tab: Tab): RecruiterInterviewItem[] {
  const now = new Date();
  switch (tab) {
    case 'upcoming':
      return interviews.filter((i) => i.scheduledAt && new Date(i.scheduledAt) > now);
    case 'today':
      return interviews.filter((i) => isToday(i.scheduledAt));
    case 'reschedule':
      return interviews.filter((i) => hasPendingRescheduleRequest(i));
    default:
      return interviews;
  }
}

type StatusFilter = 'all' | 'not_scheduled' | InterviewStatus;
type ModeFilter = 'all' | 'online' | 'in_person';

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'not_scheduled', label: 'Not Scheduled' },
  { value: InterviewStatus.SCHEDULED, label: 'Scheduled' },
  { value: InterviewStatus.RESCHEDULED, label: 'Rescheduled' },
  { value: InterviewStatus.ONGOING, label: 'Ongoing' },
  { value: InterviewStatus.COMPLETED, label: 'Completed' },
  { value: InterviewStatus.CANCELLED, label: 'Cancelled' },
  { value: InterviewStatus.NO_SHOW, label: 'No Show' },
];

const MODE_FILTER_OPTIONS: { value: ModeFilter; label: string }[] = [
  { value: 'all', label: 'All Modes' },
  { value: 'online', label: 'Online' },
  { value: 'in_person', label: 'In-Person' },
];

function filterByStatus(interviews: RecruiterInterviewItem[], status: StatusFilter): RecruiterInterviewItem[] {
  if (status === 'all') return interviews;
  if (status === 'not_scheduled') return interviews.filter((i) => !isInterviewScheduled(i));
  return interviews.filter((i) => isInterviewScheduled(i) && i.interviewStatus === status);
}

function filterByMode(interviews: RecruiterInterviewItem[], mode: ModeFilter): RecruiterInterviewItem[] {
  if (mode === 'all') return interviews;
  if (mode === 'online') return interviews.filter((i) => Boolean(i.meetingLink));
  return interviews.filter((i) => !i.meetingLink && Boolean(i.location));
}

function filterBySearch(interviews: RecruiterInterviewItem[], query: string): RecruiterInterviewItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return interviews;
  return interviews.filter((i) => {
    const candidate = (i.candidateName || '').toLowerCase();
    const email = (i.candidateEmail || '').toLowerCase();
    const job = (i.jobTitle || '').toLowerCase();
    const title = (i.title || '').toLowerCase();
    return candidate.includes(q) || email.includes(q) || job.includes(q) || title.includes(q);
  });
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
  const pendingReschedules = interviews.filter((i) => hasPendingRescheduleRequest(i)).length;

  const upcoming = interviews
    .filter((i) => i.scheduledAt && new Date(i.scheduledAt) > now)
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime());

  const nextInterview = upcoming[0]?.scheduledAt
    ? new Date(upcoming[0].scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : null;

  return { todayCount, thisWeek, completedThisMonth, pendingFeedback, pendingReschedules, nextInterview };
}

interface ScheduleModalState {
  open: boolean;
  applicationId?: string;
  interview?: RecruiterInterviewItem;
}

interface CancelModalState {
  open: boolean;
  interview?: RecruiterInterviewItem;
}

type RescheduleDecision = 'approve' | 'reject';

interface RescheduleDecisionModalState {
  open: boolean;
  decision: RescheduleDecision;
  interview?: RecruiterInterviewItem;
}

function StatCard({
  label,
  value,
  sub,
  accent = 'blue',
}: {
  label: string;
  value: string;
  sub: string;
  accent?: 'blue' | 'violet' | 'emerald' | 'amber' | 'rose';
}) {
  const accentClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className={`rounded-lg border p-4 ${accentClasses[accent]}`}>
      <div className="text-xs font-bold uppercase tracking-wider opacity-75">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs mt-2 opacity-75">{sub}</div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
  count,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
  icon?: React.ComponentType<{ size: number }>;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-sm transition-colors ${
        active
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {Icon && <Icon size={15} />}
      {label}
      {count !== undefined && (
        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
          active ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/40'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function PageBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}

export default function InterviewDashboard() {
  const [selectedTab, setSelectedTab] = useState<Tab>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, InterviewStatus>>({});
  const [rescheduleClearedIds, setRescheduleClearedIds] = useState<Record<string, boolean>>({});

  const [scheduleModal, setScheduleModal] = useState<ScheduleModalState>({ open: false });
  const [cancelModal, setCancelModal] = useState<CancelModalState>({ open: false });
  const [rescheduleDecisionModal, setRescheduleDecisionModal] = useState<RescheduleDecisionModalState>({
    open: false,
    decision: 'approve',
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const isSearchPending = searchInput !== debouncedSearch;

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all');
  const activeFilterCount = (statusFilter !== 'all' ? 1 : 0) + (modeFilter !== 'all' ? 1 : 0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  const { interviews, loading, error, refetch } = useRecruiterInterviews();
  const { submit: submitCancel, loading: cancelLoading, error: cancelError } = useCancelInterview();
  const {
    submit: submitApproveReschedule,
    loading: approveLoading,
    error: approveError,
  } = useApproveRescheduleRequest();
  const {
    submit: submitRejectReschedule,
    loading: rejectLoading,
    error: rejectError,
  } = useRejectRescheduleRequest();

  const enriched = useMemo(
    () =>
      interviews.map((i) => ({
        ...i,
        interviewStatus:
          i.interviewId && statusOverrides[i.interviewId] ? statusOverrides[i.interviewId] : i.interviewStatus,
        rescheduleRequested:
          i.interviewId && rescheduleClearedIds[i.interviewId] ? false : i.rescheduleRequested,
      })),
    [interviews, statusOverrides, rescheduleClearedIds],
  );

  const filtered = useMemo(() => {
    let result = filterByTab(enriched, selectedTab);
    result = filterByStatus(result, statusFilter);
    result = filterByMode(result, modeFilter);
    result = filterBySearch(result, debouncedSearch);
    return result;
  }, [enriched, selectedTab, statusFilter, modeFilter, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const stats = useMemo(() => deriveStats(enriched), [enriched]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, statusFilter, modeFilter, debouncedSearch]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setFilterPanelOpen(false);
      }
    }
    if (filterPanelOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [filterPanelOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function handleTabChange(tab: Tab) {
    setSelectedTab(tab);
    setCurrentPage(1);
  }

  function toggleSearch() {
    setSearchOpen((open) => {
      const next = !open;
      if (!next) setSearchInput('');
      return next;
    });
  }

  function clearSearch() {
    setSearchInput('');
    searchInputRef.current?.focus();
  }

  function clearFilters() {
    setStatusFilter('all');
    setModeFilter('all');
  }

  function handleStatusChange(interviewId: string, newStatus: InterviewStatus) {
    setStatusOverrides((prev) => ({ ...prev, [interviewId]: newStatus }));
  }

  function openScheduleForApplication(interview: RecruiterInterviewItem) {
    setScheduleModal({ open: true, applicationId: interview.applicationId, interview });
  }

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

  function openApproveReschedule(interview: RecruiterInterviewItem) {
    setRescheduleDecisionModal({ open: true, decision: 'approve', interview });
  }

  function openRejectReschedule(interview: RecruiterInterviewItem) {
    setRescheduleDecisionModal({ open: true, decision: 'reject', interview });
  }

  function closeRescheduleDecisionModal() {
    if (approveLoading || rejectLoading) return;
    setRescheduleDecisionModal({ open: false, decision: 'approve' });
  }

  async function handleApproveRescheduleDecision() {
    const interview = rescheduleDecisionModal.interview;
    if (!interview?.interviewId) return;

    const result = await submitApproveReschedule(interview.interviewId);
    if (!result) return;

    setRescheduleClearedIds((prev) => ({ ...prev, [interview.interviewId!]: true }));
    setRescheduleDecisionModal({ open: false, decision: 'approve' });
    setScheduleModal({ open: true, applicationId: interview.applicationId, interview });
    refetch();
  }

  async function handleRejectRescheduleDecision() {
    const interview = rescheduleDecisionModal.interview;
    if (!interview?.interviewId) return;

    const result = await submitRejectReschedule(interview.interviewId);
    if (!result) return;

    setRescheduleClearedIds((prev) => ({ ...prev, [interview.interviewId!]: true }));
    setRescheduleDecisionModal({ open: false, decision: 'approve' });
    refetch();
  }

  function handleConfirmRescheduleDecision() {
    return rescheduleDecisionModal.decision === 'approve'
      ? handleApproveRescheduleDecision()
      : handleRejectRescheduleDecision();
  }

  const rescheduleActionLoading =
    rescheduleDecisionModal.decision === 'approve' ? approveLoading : rejectLoading;
  const rescheduleActionError =
    rescheduleDecisionModal.decision === 'approve' ? approveError : rejectError;

  const hasActiveSearchOrFilter = Boolean(debouncedSearch.trim()) || activeFilterCount > 0;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="px-8 py-6">
            {/* Title */}
            <div className="flex items-center justify-between gap-6 mb-6">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">RecruitIQ Dashboard</p>
                <h1 className="text-3xl font-bold text-slate-900">Interviews</h1>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="flex items-center">
                  {searchOpen ? (
                    <div className="relative flex items-center">
                      <Search size={14} className="absolute left-3 text-slate-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') toggleSearch();
                        }}
                        placeholder="Search candidate, email…"
                        className="w-64 pl-8 pr-8 py-2 rounded-lg bg-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-colors"
                      />
                      {isSearchPending ? (
                        <Loader2 size={13} className="absolute right-2.5 text-slate-400 animate-spin" />
                      ) : searchInput ? (
                        <button
                          onClick={clearSearch}
                          className="absolute right-2 p-0.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <X size={13} />
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <button
                      onClick={toggleSearch}
                      className="p-2.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                    >
                      <Search size={17} />
                    </button>
                  )}
                </div>

                <button className="p-2.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors relative">
                  <Bell size={17} />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white" />
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4 mb-6">
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
                <TabButton
                  icon={History}
                  label="Reschedules"
                  active={selectedTab === 'reschedule'}
                  onClick={() => handleTabChange('reschedule')}
                  count={stats.pendingReschedules}
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Filters */}
                <div className="relative" ref={filterPanelRef}>
                  <button
                    onClick={() => setFilterPanelOpen((o) => !o)}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      activeFilterCount > 0
                        ? 'border-blue-200 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <SlidersHorizontal size={14} />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {filterPanelOpen && (
                    <div className="absolute right-0 top-11 z-50 w-72 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Filters</p>
                        {activeFilterCount > 0 && (
                          <button
                            onClick={clearFilters}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                          >
                            Clear All
                          </button>
                        )}
                      </div>

                      <div className="px-4 py-4 space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Status</label>
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          >
                            {STATUS_FILTER_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">Mode</label>
                          <select
                            value={modeFilter}
                            onChange={(e) => setModeFilter(e.target.value as ModeFilter)}
                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          >
                            {MODE_FILTER_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                  <Calendar size={14} />
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                </button>

                <button
                  onClick={() => setScheduleModal({ open: true })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold text-sm transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  Schedule
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-3">
              <StatCard
                label="Today"
                value={String(stats.todayCount)}
                sub={stats.nextInterview ? `Next @ ${stats.nextInterview}` : 'None scheduled'}
                accent="blue"
              />
              <StatCard label="This Week" value={String(stats.thisWeek)} sub="All interviews" accent="violet" />
              <StatCard label="Completed" value={String(stats.completedThisMonth)} sub="This month" accent="emerald" />
              <StatCard label="Pending" value={String(stats.pendingFeedback)} sub="Awaiting feedback" accent="amber" />
              <StatCard
                label="Reschedule"
                value={String(stats.pendingReschedules)}
                sub="Pending decision"
                accent="rose"
              />
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
            {loading && (
              <div className="flex items-center justify-center py-32 gap-3 text-slate-400 flex-1">
                <Loader2 size={24} className="animate-spin text-blue-500" />
                <span className="text-sm font-medium">Loading interviews…</span>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-32 gap-3 text-red-500 flex-1">
                <AlertCircle size={32} />
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
              <div className="flex flex-col items-center justify-center py-32 gap-2 text-slate-400 flex-1">
                <Calendar size={40} className="text-slate-200" />
                <p className="text-sm font-semibold text-slate-500 mt-2">No interviews found</p>
                <p className="text-xs text-slate-400">
                  {hasActiveSearchOrFilter
                    ? 'Try adjusting your search or filters.'
                    : selectedTab === 'reschedule'
                    ? 'No pending reschedule requests.'
                    : 'Schedule your first interview to get started.'}
                </p>
                {hasActiveSearchOrFilter && (
                  <button
                    onClick={() => {
                      clearSearch();
                      clearFilters();
                    }}
                    className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80">
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Date & Time</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Candidate</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Position</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Round</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Mode</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
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
                          onApproveReschedule={openApproveReschedule}
                          onRejectReschedule={openRejectReschedule}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-4 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">
                    Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} interviews
                  </span>
                  <div className="flex items-center gap-2">
                    <PageBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <ChevronLeft size={16} />
                    </PageBtn>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      if (totalPages <= 5) return i + 1;
                      if (currentPage <= 3) return i + 1;
                      if (currentPage >= totalPages - 2) return totalPages - 4 + i;
                      return currentPage - 2 + i;
                    }).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          p === currentPage ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <PageBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                      <ChevronRight size={16} />
                    </PageBtn>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <ScheduleInterviewModal
        isOpen={scheduleModal.open}
        onClose={closeScheduleModal}
        interview={scheduleModal.interview}
        applicationId={scheduleModal.applicationId}
        onSuccess={() => {
          closeScheduleModal();
          refetch();
        }}
      />

      <CancelInterviewModal
        isOpen={cancelModal.open}
        onClose={closeCancelModal}
        onConfirm={handleConfirmCancel}
        loading={cancelLoading}
        error={cancelError}
        candidateName={cancelModal.interview?.candidateName}
      />

      <RescheduleDecisionModal
        isOpen={rescheduleDecisionModal.open}
        decision={rescheduleDecisionModal.decision}
        interview={rescheduleDecisionModal.interview}
        loading={rescheduleActionLoading}
        error={rescheduleActionError}
        onClose={closeRescheduleDecisionModal}
        onConfirm={handleConfirmRescheduleDecision}
      />
    </div>
  );
}

// ─── Reschedule Decision Modal ───

function RescheduleDecisionModal({
  isOpen,
  decision,
  interview,
  loading,
  error,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  decision: RescheduleDecision;
  interview?: RecruiterInterviewItem;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) onClose();
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen || !interview) return null;

  const isApprove = decision === 'approve';
  const name = interview.candidateName || interview.candidateId;
  const initials = toInitials(name);
  const gradient = candidateGradient(interview.candidateId);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className={`h-1 w-full ${isApprove ? 'bg-emerald-500' : 'bg-red-500'}`} />

        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg ${
                isApprove ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}
            >
              {isApprove ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isApprove ? 'Approve Reschedule?' : 'Reject Reschedule?'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isApprove ? "Approve candidate's request" : 'Keep original time'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 pb-3">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg p-3">
            {interview.candidateProfileImage ? (
              <img
                src={interview.candidateProfileImage}
                alt={name}
                className="w-10 h-10 rounded-lg object-cover shadow-sm flex-shrink-0"
              />
            ) : (
              <div
                className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0`}
              >
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-800 truncate">{name}</div>
              <div className="text-xs text-slate-400 truncate">{interview.jobTitle || interview.jobId}</div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-3">
          <div className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
            <CalendarClock size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Currently Scheduled</p>
              <p className="text-xs font-semibold text-amber-900">{formatFullDateTime(interview.scheduledAt)}</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-3">
          <p className="text-sm text-slate-600">
            {isApprove ? (
              <>You'll pick a new time after confirming this approval.</>
            ) : (
              <>The interview stays at its current time, and the candidate will be notified.</>
            )}
          </p>
        </div>

        {error && (
          <div className="mx-6 mb-3 flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg p-3 text-red-600">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <p className="text-xs">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60 ${
              isApprove ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Wait…' : isApprove ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Interview Row ───

function InterviewRow({
  interview,
  onStatusChange,
  onOpenSchedule,
  onOpenReschedule,
  onOpenCancel,
  onApproveReschedule,
  onRejectReschedule,
}: {
  interview: RecruiterInterviewItem;
  onStatusChange: (id: string, status: InterviewStatus) => void;
  onOpenSchedule: (interview: RecruiterInterviewItem) => void;
  onOpenReschedule: (interview: RecruiterInterviewItem) => void;
  onOpenCancel: (interview: RecruiterInterviewItem) => void;
  onApproveReschedule: (interview: RecruiterInterviewItem) => void;
  onRejectReschedule: (interview: RecruiterInterviewItem) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { date, time } = formatScheduledAt(interview.scheduledAt);
  const gradient = candidateGradient(interview.candidateId);
  const scheduled = isInterviewScheduled(interview);
  const upcoming = isUpcomingInterview(interview);
  const modifiable = canModifyInterview(interview);
  const pendingReschedule = hasPendingRescheduleRequest(interview);
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
      className={`transition-colors ${
        pendingReschedule ? 'bg-rose-50/40 hover:bg-rose-50/60' : scheduled ? 'hover:bg-blue-50/20' : 'hover:bg-blue-50/40 cursor-pointer'
      }`}
    >
      {/* Date & Time */}
      <td className="px-5 py-4">
        {scheduled ? (
          <div className="flex items-start gap-2">
            {todayFlag && <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 ring-2 ring-blue-100" />}
            <div>
              <div className="text-sm font-semibold text-slate-800">{date}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <Clock size={11} />
                {time}
              </div>
              {todayFlag && <span className="text-[10px] font-bold text-blue-600 mt-1 block">TODAY</span>}
            </div>
          </div>
        ) : (
          <span className="text-sm text-slate-300">—</span>
        )}
      </td>

      {/* Candidate */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          {interview.candidateProfileImage ? (
            <img src={interview.candidateProfileImage} alt={name} className="w-8 h-8 rounded-lg object-cover shadow-sm flex-shrink-0" />
          ) : (
            <div
              className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0`}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800">{name}</div>
            <div className="text-xs text-slate-400">{interview.candidateEmail || '—'}</div>
          </div>
        </div>
      </td>

      {/* Position */}
      <td className="px-5 py-4">
        <div className="text-sm font-medium text-slate-700">{jobTitle}</div>
        {interview.title && <div className="text-xs text-slate-400 mt-0.5">{interview.title}</div>}
      </td>

      {/* Round */}
      <td className="px-5 py-4">
        {interview.round != null ? (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
            {interview.round}
          </span>
        ) : (
          <span className="text-slate-300 text-sm">—</span>
        )}
      </td>

      {/* Mode */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          {interview.meetingLink ? (
            <>
              <Video size={14} className="text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Online</span>
            </>
          ) : interview.location ? (
            <>
              <MapPin size={14} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-700">{interview.location}</span>
            </>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap ${statusCfg.pill}`}>
          <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
          {statusCfg.label}
        </span>
        {pendingReschedule && (
          <div className="text-[10px] text-rose-600 font-bold mt-1.5">⚠ RESCHEDULE REQ</div>
        )}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2 relative">
          {modifiable && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReschedule(interview);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium transition-colors whitespace-nowrap"
                title="Reschedule interview"
              >
                Reschedule
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCancel(interview);
                }}
                className="px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors whitespace-nowrap"
                title="Cancel interview"
              >
                Cancel
              </button>
            </>
          )}

          {pendingReschedule && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApproveReschedule(interview);
                }}
                className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-medium transition-colors whitespace-nowrap"
                title="Approve reschedule request"
              >
                Approve
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRejectReschedule(interview);
                }}
                className="px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors whitespace-nowrap"
                title="Reject reschedule request"
              >
                Reject
              </button>
            </>
          )}

          {!scheduled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenSchedule(interview);
              }}
              className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium transition-colors whitespace-nowrap"
              title="Schedule interview"
            >
              Schedule
            </button>
          )}

          {transitions.length > 0 && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="More actions"
              >
                <MoreVertical size={14} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 z-40 w-40 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                  {transitions.map((t) => (
                    <button
                      key={t.status}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(interview.interviewId!, t.status);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
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
      </td>
    </tr>
  );
}
