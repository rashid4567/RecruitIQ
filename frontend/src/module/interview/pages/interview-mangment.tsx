import { useState, useMemo, useRef, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  Plus,
  ChevronRight,
  BarChart3,
  Search,
  Bell,
  Loader2,
  AlertCircle,
  History,
  X,
  SlidersHorizontal,
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
import InterviewRow from "./components/interview.mangment/Interviewrow";
import RescheduleDecisionModal from "./components/interview.mangment/Rescheduledecisionmodal";
import RecruiterInterviewDetailModal from "./components/interview.mangment/RecruiterInterviewDetailModal";

import type {
  Tab,
  StatusFilter,
  ModeFilter,
  ScheduleModalState,
  CancelModalState,
  RescheduleDecisionModalState,
} from "../types/Interviewdashboard.types";

import {
  ITEMS_PER_PAGE,
  SEARCH_DEBOUNCE_MS,
  useDebouncedValue,
  filterByTab,
  filterByStatus,
  filterByMode,
  filterBySearch,
  deriveStats,
  STATUS_FILTER_OPTIONS,
  MODE_FILTER_OPTIONS,
} from "./components/interview.mangment/Interviewdashboard.helpers";

export default function InterviewDashboard() {
  const [selectedTab, setSelectedTab] = useState<Tab>("all");
  const [currentPage, setCurrentPage] = useState(1);
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

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const isSearchPending = searchInput !== debouncedSearch;

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) + (modeFilter !== "all" ? 1 : 0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const stats = useMemo(() => deriveStats(enriched), [enriched]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, statusFilter, modeFilter, debouncedSearch]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(e.target as Node)
      ) {
        setFilterPanelOpen(false);
      }
    }
    if (filterPanelOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
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
      if (!next) setSearchInput("");
      return next;
    });
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

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between gap-6 mb-6">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">
                  RecruitIQ Dashboard
                </p>
                <h1 className="text-3xl font-bold text-slate-900">
                  Interviews
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {searchOpen ? (
                    <div className="relative flex items-center">
                      <Search
                        size={14}
                        className="absolute left-3 text-slate-400"
                      />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") toggleSearch();
                        }}
                        placeholder="Search candidate, email…"
                        className="w-64 pl-8 pr-8 py-2 rounded-lg bg-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-colors"
                      />
                      {isSearchPending ? (
                        <Loader2
                          size={13}
                          className="absolute right-2.5 text-slate-400 animate-spin"
                        />
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

            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <TabButton
                  icon={BarChart3}
                  label="Timeline"
                  active={selectedTab === "timeline"}
                  onClick={() => handleTabChange("timeline")}
                />
                <TabButton
                  label="All"
                  active={selectedTab === "all"}
                  onClick={() => handleTabChange("all")}
                  count={enriched.length}
                />
                <TabButton
                  label="Upcoming"
                  active={selectedTab === "upcoming"}
                  onClick={() => handleTabChange("upcoming")}
                  count={
                    enriched.filter(
                      (i) =>
                        i.scheduledAt && new Date(i.scheduledAt) > new Date(),
                    ).length
                  }
                />
                <TabButton
                  label="Today"
                  active={selectedTab === "today"}
                  onClick={() => handleTabChange("today")}
                  count={stats.todayCount}
                />
                <TabButton
                  icon={History}
                  label="Reschedules"
                  active={selectedTab === "reschedule"}
                  onClick={() => handleTabChange("reschedule")}
                  count={stats.pendingReschedules}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative" ref={filterPanelRef}>
                  <button
                    onClick={() => setFilterPanelOpen((o) => !o)}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      activeFilterCount > 0
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
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
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                          Filters
                        </p>
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
                          <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Status
                          </label>
                          <select
                            value={statusFilter}
                            onChange={(e) =>
                              setStatusFilter(e.target.value as StatusFilter)
                            }
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
                          <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Mode
                          </label>
                          <select
                            value={modeFilter}
                            onChange={(e) =>
                              setModeFilter(e.target.value as ModeFilter)
                            }
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
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                  })}
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

            <div className="grid grid-cols-5 gap-3">
              <StatCard
                label="Today"
                value={String(stats.todayCount)}
                sub={
                  stats.nextInterview
                    ? `Next @ ${stats.nextInterview}`
                    : "None scheduled"
                }
                accent="blue"
              />
              <StatCard
                label="This Week"
                value={String(stats.thisWeek)}
                sub="All interviews"
                accent="violet"
              />
              <StatCard
                label="Completed"
                value={String(stats.completedThisMonth)}
                sub="This month"
                accent="emerald"
              />
              <StatCard
                label="Pending"
                value={String(stats.pendingFeedback)}
                sub="Awaiting feedback"
                accent="amber"
              />
              <StatCard
                label="Reschedule"
                value={String(stats.pendingReschedules)}
                sub="Pending decision"
                accent="rose"
              />
            </div>
          </div>
        </header>

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
                <p className="text-sm font-semibold text-slate-500 mt-2">
                  No interviews found
                </p>
                <p className="text-xs text-slate-400">
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
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Candidate
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Round
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Mode
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
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
                          onJoinInterview={handleJoinInterview}
                          onOpenDetail={openDetailModal}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-4 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">
                    Showing{" "}
                    {filtered.length === 0
                      ? 0
                      : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                    –{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}{" "}
                    of {filtered.length} interviews
                  </span>
                  <div className="flex items-center gap-2">
                    <PageBtn
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </PageBtn>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      if (totalPages <= 5) return i + 1;
                      if (currentPage <= 3) return i + 1;
                      if (currentPage >= totalPages - 2)
                        return totalPages - 4 + i;
                      return currentPage - 2 + i;
                    }).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          p === currentPage
                            ? "bg-blue-600 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
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
