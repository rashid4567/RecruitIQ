import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useJobApplications } from "../../hooks/recruiter/useJobApplications";
import { ApplicationStatus } from "@/module/job-application/domain/entity/job-application.entity";

import { TopBar } from "../component/Recruiter.application/Topbar";
import { JobHeader } from "../component/Recruiter.application/Jobheader";
import { FilterToolbar } from "../component/Recruiter.application/Filtertoolbar";
import { ApplicationTable } from "../component/Recruiter.application/Applicationtable";
import { Pagination } from "../component/Recruiter.application/Pagination";
import { ALL_STATUSES } from "../component/Recruiter.application/Status.constants";
import {
  getInitials,
  fakeAiScore,
  fakeMatchPercent,
  aiScoreBarColor,
  formatDate,
} from "../component/Recruiter.application/Helpers";
import type {
  ApplicationRow,
  JobMeta,
  SortOption,
} from "../component/Recruiter.application/Application.types";
import Sidebar from "@/module/recruiter/presentation/pages/components/layout/Sidebar";

const ITEMS_PER_PAGE = 8;

export default function RecruiterApplication() {
  const { jobId } = useParams<{ jobId: string }>();
  const { loading, error, applications, fetchApplications } =
    useJobApplications();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("Application Date");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">(
    "All",
  );
  const [matchScoreRange, setMatchScoreRange] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (jobId) fetchApplications(jobId);
  }, [jobId, fetchApplications]);

  const rows: ApplicationRow[] = useMemo(
    () =>
      applications.map((app) => {
        const aiScore = fakeAiScore(app.applicationId);
        const matchPercent = fakeMatchPercent(app.candidateId);
        return {
          id: app.applicationId,
          candidateId: app.candidateId,
          name: app.candidateName,
          initials: getInitials(app.candidateName),
          email: app.candidateEmail,
          profileImage: app.candidateProfileImage,
          applicationDate: formatDate(app.appliedAt),
          appliedAtRaw: app.appliedAt,
          aiScore,
          matchPercent,
          status: app.status,
          scoreBarColor: aiScoreBarColor(aiScore),
        };
      }),
    [applications],
  );

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = rows.filter((r) => {
      const statusOk = statusFilter === "All" || r.status === statusFilter;
      const matchOk = r.matchPercent <= matchScoreRange;
      const searchOk =
        q === "" ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.candidateId.toLowerCase().includes(q);
      return statusOk && matchOk && searchOk;
    });

    switch (sortBy) {
      case "Application Date":
        list.sort(
          (a, b) =>
            new Date(b.appliedAtRaw).getTime() -
            new Date(a.appliedAtRaw).getTime(),
        );
        break;
      case "Match Score":
        list.sort((a, b) => b.matchPercent - a.matchPercent);
        break;
      case "AI Score":
        list.sort((a, b) => b.aiScore - a.aiScore);
        break;
      case "Name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [rows, statusFilter, matchScoreRange, sortBy, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ITEMS_PER_PAGE),
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const toggleSelectAll = (checked: boolean) =>
    setSelectedRows(
      checked ? new Set(paginatedRows.map((r) => r.id)) : new Set(),
    );

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isAllSelected =
    paginatedRows.length > 0 &&
    paginatedRows.every((r) => selectedRows.has(r.id));

  const statusCounts = useMemo(() => {
    const counts: Partial<Record<ApplicationStatus | "All", number>> = {
      All: rows.length,
    };
    ALL_STATUSES.forEach((s) => (counts[s] = 0));
    rows.forEach((r) => {
      counts[r.status] = (counts[r.status] ?? 0) + 1;
    });
    return counts;
  }, [rows]);

  const displayJob: JobMeta = {
    id: jobId ?? "",
    title: "Job Applications",
    applications: applications.length,
    postedDate: "—",
  };

  const handleStatusChange = (s: ApplicationStatus | "All") => {
    setStatusFilter(s);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleMatchScoreChange = (value: number) => {
    setMatchScoreRange(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setMatchScoreRange(100);
  };

  const handleBulkSuccess = () => {
    if (jobId) fetchApplications(jobId);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          onRefresh={() => jobId && fetchApplications(jobId)}
          isRefreshing={loading}
        />

        <JobHeader
          job={displayJob}
          statusFilter={statusFilter}
          statusCounts={statusCounts}
          loading={loading}
          error={error}
          onStatusChange={handleStatusChange}
        />

        <FilterToolbar
          searchQuery={searchQuery}
          sortBy={sortBy}
          statusFilter={statusFilter}
          matchScoreRange={matchScoreRange}
          selectedIds={[...selectedRows]}
          onSearchChange={handleSearchChange}
          onSortChange={setSortBy}
          onStatusChange={handleStatusChange}
          onMatchScoreChange={handleMatchScoreChange}
          onClearSelection={() => setSelectedRows(new Set())}
          onBulkSuccess={handleBulkSuccess}
        />

        <div className="flex-1 overflow-auto px-6 py-5">
          <ApplicationTable
            rows={paginatedRows}
            selectedRows={selectedRows}
            isAllSelected={isAllSelected}
            loading={loading}
            error={error}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectRow={toggleSelectRow}
            onRetry={() => jobId && fetchApplications(jobId)}
            onClearFilters={clearFilters}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredRows.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
