import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "@/module/recruiter/pages/components/layout/Sidebar";
import { useJobApplications } from "../../hooks/recruiter/useJobApplications";
import type {
  ApplicationRow,
  JobMeta,
  SortOption,
} from "../component/Recruiter.application/Application.types";
import type { ApplicationStatus } from "../../types/jobApplication.types";
import { getInitials } from "../component/recruiter-application.detail/Indexs";
import { formatDate } from "../component/candidate-details/Formatters";
import { aiScoreBarColor } from "../component/Recruiter.application/Helpers";
import { ALL_STATUSES } from "../component/Recruiter.application/Status.constants";
import { TopBar } from "../component/Recruiter.application/Topbar";
import { JobHeader } from "../component/Recruiter.application/Jobheader";
import { FilterToolbar } from "../component/Recruiter.application/Filtertoolbar";
import { ApplicationTable } from "../component/Recruiter.application/Applicationtable";
import { Pagination } from "../component/Recruiter.application/Pagination";
import { useCloseJob } from "@/module/jobs/hooks/Recruiter-jobPost/useCloseJob";
const ITEMS_PER_PAGE = 8;

export default function RecruiterApplication() {
  const { jobId } = useParams<{ jobId: string }>();
  const { loading, error, applications, fetchApplications } =
    useJobApplications();
  const { handleCloseJob, loading: closingJob } = useCloseJob();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("Application Date");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">(
    "All",
  );
  const [matchScoreMin, setMatchScoreMin] = useState(0);
  const [matchScoreMax, setMatchScoreMax] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (jobId) fetchApplications(jobId);
  }, [jobId, fetchApplications]);

  const rows: ApplicationRow[] = useMemo(
    () =>
      applications.map((app) => {
        const aiScore = app.aiScore ?? 0;
        const matchPercent = app.aiScore ?? 0;
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
      const matchOk =
        r.matchPercent >= matchScoreMin && r.matchPercent <= matchScoreMax;
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
  }, [rows, statusFilter, matchScoreMin, matchScoreMax, sortBy, searchQuery]);

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
  const handleJobClose = async () => {
    if (!jobId) return;

    const success = await handleCloseJob(jobId);

    if (success) {
      fetchApplications(jobId);
    }
  };

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

  const isIndeterminate =
    paginatedRows.length > 0 &&
    !isAllSelected &&
    paginatedRows.some((r) => selectedRows.has(r.id));

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

  const handleMatchScoreMinChange = (value: number) => {
    setMatchScoreMin(value);
    setCurrentPage(1);
  };

  const handleMatchScoreMaxChange = (value: number) => {
    setMatchScoreMax(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setMatchScoreMin(0);
    setMatchScoreMax(100);
    setCurrentPage(1);
  };

  const handleBulkSuccess = () => {
    if (jobId) fetchApplications(jobId);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
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
          onCloseJob={handleJobClose}
          closingJob={closingJob}
        />

        <FilterToolbar
          searchQuery={searchQuery}
          sortBy={sortBy}
          statusFilter={statusFilter}
          matchScoreMin={matchScoreMin}
          matchScoreMax={matchScoreMax}
          selectedIds={[...selectedRows]}
          onSearchChange={handleSearchChange}
          onSortChange={setSortBy}
          onStatusChange={handleStatusChange}
          onMatchScoreMinChange={handleMatchScoreMinChange}
          onMatchScoreMaxChange={handleMatchScoreMaxChange}
          onClearSelection={() => setSelectedRows(new Set())}
          onBulkSuccess={handleBulkSuccess}
        />

        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="max-w-350 mx-auto">
            <ApplicationTable
              rows={paginatedRows}
              selectedRows={selectedRows}
              isAllSelected={isAllSelected}
              isIndeterminate={isIndeterminate}
              loading={loading}
              error={error}
              onToggleSelectAll={toggleSelectAll}
              onToggleSelectRow={toggleSelectRow}
              onRetry={() => jobId && fetchApplications(jobId)}
              onClearFilters={clearFilters}
            />
          </div>
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