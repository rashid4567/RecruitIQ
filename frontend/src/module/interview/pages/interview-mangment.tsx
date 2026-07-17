import { useMemo, useRef, useState, useEffect } from "react";
import {
  AlertCircle,
  BarChart3,
  Bell,
  CalendarClock,
  CalendarPlus,
  CalendarX2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  History,
  Hourglass,
  SearchX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScheduleInterviewModal from "./components/schedule-interview-modal";
import CancelInterviewModal from "./components/cancel-interview-modal";
import Sidebar from "@/module/recruiter/pages/components/layout/Sidebar";
import { useRecruiterInterviews } from "../hooks/recruiter/useRecruiterInterviews";
import { useCancelInterview } from "../hooks/recruiter/useCancelInterview";
import { useApproveRescheduleRequest } from "../hooks/recruiter/useApproveRescheduleRequest";
import { useRejectRescheduleRequest } from "../hooks/recruiter/useRejectRescheduleRequest";
import { useStartInterview } from "../hooks/recruiter/useStartInterview";
import type { RecruiterInterviewItem } from "../types/recruiterInterview.types";
import { InterviewStatus } from "../types/interview.types";
import StatCard from "./components/interview.mangment/StatCard";
import TabButton from "./components/interview.mangment/Tabbutton";
import PageBtn from "./components/interview.mangment/Pagebtn";
import FilterBar from "./components/interview.mangment/Filterbar"
import InterviewsSkeleton from "./components/interview.mangment/Interviewsskeleton";
import InterviewRow, {
  INTERVIEW_GRID_COLS,
} from "./components/interview.mangment/Interviewrow";
import RescheduleDecisionModal from "./components/interview.mangment/Rescheduledecisionmodal";
import RecruiterInterviewDetailModal from "./components/interview.mangment/RecruiterInterviewDetailModal";

import type {
  Tab,
  StatusFilter,
  ModeFilter,
  ScheduleModalState,
  CancelModalState,
  RescheduleDecisionModalState,
} from "./components/interview.mangment/Interviewdashboard.types";

import {
  ITEMS_PER_PAGE,
  SEARCH_DEBOUNCE_MS,
  useDebouncedValue,
  filterByTab,
  filterByStatus,
  filterByMode,
  filterBySearch,
  deriveStats,
} from "./components/interview.mangment/Interviewdashboard.helpers";
import Header from "@/module/auth/pages/home/header";

const PAGE_SIZE_OPTIONS = [8, 20, 50, 100];

export default function InterviewDashboard() {
  const [selectedTab, setSelectedTab] = useState<Tab>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, InterviewStatus>
  >({});
  const [rescheduleClearedIds, setRescheduleClearedIds] = useState<
    Record<string, boolean>
  >({});
  const [scheduleModal, setScheduleModal] = useState<ScheduleModalState>({
    open: false,
  });
  const [cancelModal, setCancelModal] = useState<CancelModalState>({
    open: false,
  });
  const [rescheduleDecisionModal, setRescheduleDecisionModal] =
    useState<RescheduleDecisionModalState>({
      open: false,
      decision: "approve",
    });
  const [detailModalInterview, setDetailModalInterview] =
    useState<RecruiterInterviewItem | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const isSearchPending = searchInput !== debouncedSearch;

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) + (modeFilter !== "all" ? 1 : 0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { interviews, loading, error, refetch } = useRecruiterInterviews();
  const {
    submit: submitCancel,
    loading: cancelLoading,
    error: cancelError,
  } = useCancelInterview();
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
  const {
    submit: submitStart,
    loading: startLoading,
    error: startError,
  } = useStartInterview();

  function handleJoinInterview(interview: RecruiterInterviewItem) {
    if (!interview.interviewId) return;
    navigate(`/recruiter/interviews/${interview.interviewId}/lobby`, {
      state: { roomId: interview.roomId },
    });
  }

  async function handleStartInterview(interview: RecruiterInterviewItem) {
    if (!interview.interviewId) return;

    const result = await submitStart(interview.interviewId);
    if (!result) return;

    setStatusOverrides((prev) => ({
      ...prev,
      [interview.interviewId!]: result.status,
    }));
    setDetailModalInterview(null);
    refetch();
    handleJoinInterview({ ...interview, interviewStatus: result.status });
  }

  function openDetailModal(interview: RecruiterInterviewItem) {
    setDetailModalInterview(interview);
  }

  function closeDetailModal() {
    setDetailModalInterview(null);
  }

  const enriched = useMemo(
    () =>
      interviews.map((i) => ({
        ...i,
        interviewStatus:
          i.interviewId && statusOverrides[i.interviewId]
            ? statusOverrides[i.interviewId]
            : i.interviewStatus,
        rescheduleRequested:
          i.interviewId && rescheduleClearedIds[i.interviewId]
            ? false
            : i.rescheduleRequested,
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const stats = useMemo(() => deriveStats(enriched), [enriched]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, statusFilter, modeFilter, debouncedSearch, pageSize]);

  function handleTabChange(tab: Tab) {
    setSelectedTab(tab);
    setCurrentPage(1);
  }

  function clearSearch() {
    setSearchInput("");
    searchInputRef.current?.focus();
  }

  function clearFilters() {
    setStatusFilter("all");
    setModeFilter("all");
  }

  function handleStatusChange(interviewId: string, newStatus: InterviewStatus) {
    setStatusOverrides((prev) => ({ ...prev, [interviewId]: newStatus }));
  }

  function openScheduleForApplication(interview: RecruiterInterviewItem) {
    setDetailModalInterview(null);
    setScheduleModal({
      open: true,
      applicationId: interview.applicationId,
      interview,
    });
  }

  function openReschedule(interview: RecruiterInterviewItem) {
    setDetailModalInterview(null);
    setScheduleModal({
      open: true,
      applicationId: interview.applicationId,
      interview,
    });
  }

  function closeScheduleModal() {
    setScheduleModal({ open: false });
  }

  function openCancel(interview: RecruiterInterviewItem) {
    setDetailModalInterview(null);
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
      setStatusOverrides((prev) => ({
        ...prev,
        [interview.interviewId!]: InterviewStatus.CANCELLED,
      }));
      setCancelModal({ open: false });
      refetch();
    }
  }

  function openApproveReschedule(interview: RecruiterInterviewItem) {
    setDetailModalInterview(null);
    setRescheduleDecisionModal({ open: true, decision: "approve", interview });
  }

  function openRejectReschedule(interview: RecruiterInterviewItem) {
    setDetailModalInterview(null);
    setRescheduleDecisionModal({ open: true, decision: "reject", interview });
  }

  function closeRescheduleDecisionModal() {
    if (approveLoading || rejectLoading) return;
    setRescheduleDecisionModal({ open: false, decision: "approve" });
  }

  async function handleApproveRescheduleDecision() {
    const interview = rescheduleDecisionModal.interview;
    if (!interview?.interviewId) return;

    const result = await submitApproveReschedule(interview.interviewId);
    if (!result) return;

    setRescheduleClearedIds((prev) => ({
      ...prev,
      [interview.interviewId!]: true,
    }));
    setRescheduleDecisionModal({ open: false, decision: "approve" });
    setScheduleModal({
      open: true,
      applicationId: interview.applicationId,
      interview,
    });
    refetch();
  }

  async function handleRejectRescheduleDecision() {
    const interview = rescheduleDecisionModal.interview;
    if (!interview?.interviewId) return;

    const result = await submitRejectReschedule(interview.interviewId);
    if (!result) return;

    setRescheduleClearedIds((prev) => ({
      ...prev,
      [interview.interviewId!]: true,
    }));
    setRescheduleDecisionModal({ open: false, decision: "approve" });
    refetch();
  }

  function handleConfirmRescheduleDecision() {
    return rescheduleDecisionModal.decision === "approve"
      ? handleApproveRescheduleDecision()
      : handleRejectRescheduleDecision();
  }

  const rescheduleActionLoading =
    rescheduleDecisionModal.decision === "approve"
      ? approveLoading
      : rejectLoading;
  const rescheduleActionError =
    rescheduleDecisionModal.decision === "approve" ? approveError : rejectError;

  const hasActiveSearchOrFilter =
    Boolean(debouncedSearch.trim()) || activeFilterCount > 0;

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, filtered.length);

  return (
    <div className="flex h-screen bg-slate-50">
      <Header/>
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex h-screen flex-1 flex-col overflow-hidden">
     
        <header className="shrink-0 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Interviews
              </h1>
              <p className="truncate text-xs text-slate-500 sm:text-sm">
                {stats.todayCount > 0
                  ? `${stats.todayCount} scheduled today`
                  : `${enriched.length} total interviews`}
                {stats.nextInterview && ` · next at ${stats.nextInterview}`}
              </p>
            </div>

            <button
              onClick={() => navigate("/recruiter/notification")}
              className="relative shrink-0 rounded-lg bg-slate-100 p-2.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
              title="Notifications"
            >
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-white" />
            </button>
          </div>

          <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto px-4 pb-3 sm:px-6">
            <TabButton
              label="All"
              active={selectedTab === "all"}
              onClick={() => handleTabChange("all")}
              count={enriched.length}
            />
            <TabButton
              label="Today"
              active={selectedTab === "today"}
              onClick={() => handleTabChange("today")}
              count={stats.todayCount}
            />
            <TabButton
              label="Upcoming"
              active={selectedTab === "upcoming"}
              onClick={() => handleTabChange("upcoming")}
              count={
                enriched.filter(
                  (i) => i.scheduledAt && new Date(i.scheduledAt) > new Date(),
                ).length
              }
            />
            <TabButton
              icon={History}
              label="Reschedules"
              active={selectedTab === "reschedule"}
              onClick={() => handleTabChange("reschedule")}
              count={stats.pendingReschedules}
            />
            <TabButton
              icon={BarChart3}
              label="Timeline"
              active={selectedTab === "timeline"}
              onClick={() => handleTabChange("timeline")}
            />
          </div>
        </header>

        <FilterBar
          searchInputRef={searchInputRef}
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          onClearSearch={clearSearch}
          isSearchPending={isSearchPending}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          modeFilter={modeFilter}
          onModeFilterChange={setModeFilter}
          activeFilterCount={activeFilterCount}
          onReset={clearFilters}
        />

        <div className="grid shrink-0 grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
          <StatCard
            label="Today"
            value={String(stats.todayCount)}
            sub={stats.nextInterview ? `Next @ ${stats.nextInterview}` : "None scheduled"}
            accent="blue"
            icon={CalendarClock}
          />
          <StatCard
            label="This Week"
            value={String(stats.thisWeek)}
            sub="All interviews"
            accent="violet"
            icon={CalendarPlus}
          />
          <StatCard
            label="Completed"
            value={String(stats.completedThisMonth)}
            sub="This month"
            accent="emerald"
            icon={CheckCircle2}
          />
          <StatCard
            label="Pending"
            value={String(stats.pendingFeedback)}
            sub="Awaiting feedback"
            accent="amber"
            icon={Hourglass}
          />
          <StatCard
            label="Reschedule"
            value={String(stats.pendingReschedules)}
            sub="Pending decision"
            accent="rose"
            icon={CalendarX2}
          />
        </div>

        {/* Data area */}
        <div className="flex flex-1 flex-col overflow-hidden px-4 pb-4 sm:px-6">
          <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {loading && (
              <div className="flex-1 overflow-y-auto">
                <InterviewsSkeleton />
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <AlertCircle size={24} />
                </span>
                <p className="text-sm font-semibold text-slate-700">
                  Couldn't load interviews
                </p>
                <p className="max-w-xs text-xs text-slate-400">{error}</p>
                <button
                  onClick={refetch}
                  className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                  {hasActiveSearchOrFilter ? (
                    <SearchX size={26} />
                  ) : (
                    <CalendarClock size={26} />
                  )}
                </span>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  No interviews found
                </p>
                <p className="max-w-xs text-xs text-slate-400">
                  {hasActiveSearchOrFilter
                    ? "Try adjusting your search or filters."
                    : selectedTab === "reschedule"
                      ? "No pending reschedule requests."
                      : "Schedule your first interview to get started."}
                </p>
                {hasActiveSearchOrFilter && (
                  <button
                    onClick={() => {
                      clearSearch();
                      clearFilters();
                    }}
                    className="mt-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <>
                {/* Column headers — desktop/tablet only, sticky */}
                <div
                  className={`sticky top-0 z-10 hidden ${INTERVIEW_GRID_COLS} items-center gap-3 border-b border-slate-200 bg-slate-50/90 px-5 py-3 backdrop-blur sm:grid`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Date & Time
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Candidate
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Position
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mode
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </span>
                  <span className="text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto">
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
                      onJoinInterview={handleJoinInterview}
                      onOpenDetail={openDetailModal}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex shrink-0 flex-col gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-600">
                      Showing {rangeStart}–{rangeEnd} of {filtered.length}
                    </span>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      Rows
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="rounded-md border border-slate-200 bg-white px-1.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        {PAGE_SIZE_OPTIONS.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <PageBtn
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </PageBtn>
                    <span className="px-2 text-xs font-semibold text-slate-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <PageBtn
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
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

      <RecruiterInterviewDetailModal
        interview={detailModalInterview}
        onClose={closeDetailModal}
        onReschedule={openReschedule}
        onCancel={openCancel}
        onApproveReschedule={openApproveReschedule}
        onRejectReschedule={openRejectReschedule}
        onStartInterview={handleStartInterview}
        onJoinInterview={handleJoinInterview}
        startLoading={startLoading}
        startError={startError}
      />
    </div>
  );
}