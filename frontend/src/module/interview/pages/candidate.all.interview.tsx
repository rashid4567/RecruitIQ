import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useCandidateInterviews } from "../hooks/candidate/useCandidateInterviews";
import { useJoinInterview } from "../hooks/candidate/useJoinInterview";
import type { GetCandidateInterviewsResponse } from "../types/candidateInterview.types";
import {
  CandidateResponseStatus,
  InterviewStatus,
} from "../types/interview.types";
import Sidebar from "../../candidate/pages/components/personalInfo/shared/candidateSidebar";
import Header from "@/pages/landing/sections/Header";
import InterviewDecisionModal from "./components/interview-decision-modal";
import RequestRescheduleModal from "./components/request-reschedule-modal";

import type {
  DecisionModalState,
  ExpandedState,
  ModeFilter,
  RescheduleModalState,
  StatusFilter,
  ViewMode,
} from "./components/candidate-interviews/Types";
import {
  ITEMS_PER_PAGE,
  groupByDate,
  groupByMonth,
  isPast,
  isScheduledInterview,
  isUpcoming,
  matchesFilters,
  normalizeToArray,
} from "./components/candidate-interviews/Utils";

import StatCard from "./components/candidate-interviews/Statcard";
import NextInterviewBanner from "./components/candidate-interviews/Nextinterviewbanner";
import UpcomingInterviewsGrid from "./components/candidate-interviews/Upcominginterviewsgrid";
import FiltersToolbar from "./components/candidate-interviews/Filterstoolbar";
import TimelineView from "./components/candidate-interviews/Timelineview";
import ListView from "./components/candidate-interviews/Listview";
import CalendarView from "./components/candidate-interviews/Calendarview";
import {
  NoInterviewsEmptyState,
  NoResultsEmptyState,
} from "./components/candidate-interviews/Emptystates";

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

    try {
      const result = await submitJoin(interview.id);

      if (!result) return;

      navigate(`/candidate/interviews/${interview.id}/lobby`);
    } finally {
      setJoiningId(null);
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
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2.5"
                >
                  <AlertCircle
                    size={14}
                    className="text-red-500 shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-red-700">
                      Couldn't join the interview
                    </p>
                    <p className="text-xs text-red-600 mt-0.5">{joinError}</p>
                  </div>
                  <button
                    onClick={() => setJoinError(null)}
                    className="text-[11px] font-semibold text-red-500 hover:text-red-700 shrink-0"
                  >
                    Dismiss
                  </button>
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
                <NextInterviewBanner
                  interview={nextInterview}
                  joiningId={joiningId}
                  onGoTo={goToInterview}
                  onOpenDecision={openDecision}
                  onOpenReschedule={openRescheduleRequest}
                  onJoin={handleJoin}
                />
              )}

              <UpcomingInterviewsGrid
                interviews={restUpcoming}
                joiningId={joiningId}
                onGoTo={goToInterview}
                onOpenDecision={openDecision}
                onOpenReschedule={openRescheduleRequest}
                onJoin={handleJoin}
              />

              <FiltersToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                modeFilter={modeFilter}
                onModeFilterChange={setModeFilter}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
              />

              {scheduledInterviews.length === 0 && <NoInterviewsEmptyState />}

              {scheduledInterviews.length > 0 &&
                filteredInterviews.length === 0 && (
                  <NoResultsEmptyState onClearFilters={clearFilters} />
                )}

              {viewMode === "timeline" && pastInterviews.length > 0 && (
                <TimelineView
                  groupedByDate={pastGroupedByDate}
                  expandedDates={expandedDates}
                  onToggleDate={toggleDate}
                  onGoTo={goToInterview}
                  page={safePage}
                  totalPages={totalPages}
                  totalItems={viewSource.length}
                  pageSize={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              )}

              {viewMode === "list" && filteredInterviews.length > 0 && (
                <ListView
                  items={paginatedViewSource}
                  onGoTo={goToInterview}
                  onOpenDecision={openDecision}
                  page={safePage}
                  totalPages={totalPages}
                  totalItems={viewSource.length}
                  pageSize={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              )}

              {viewMode === "calendar" && filteredInterviews.length > 0 && (
                <CalendarView
                  groupedByMonth={groupedByMonth}
                  onGoTo={goToInterview}
                  page={safePage}
                  totalPages={totalPages}
                  totalItems={viewSource.length}
                  pageSize={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
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