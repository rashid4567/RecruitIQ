"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutGrid,
  Briefcase,
  Users,
  Calendar,
  PhoneOff,
  User,
  CreditCard,
  LogOut,
  Bell,
  Plus,
  ChevronLeft,
  EllipsisVertical,
  Search,
  RefreshCw,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useJobApplications } from "../../hooks/recruiter/useJobApplications";
import {
  ApplicationStatus,
} from "@/module/job-application/domain/entity/job-application.entity";

// ────────────────────── Status maps ──────────────────────

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  SHORTLISTED: "Shortlisted",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  SELECTED: "Selected",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  APPLIED: "bg-blue-50 text-blue-700 border border-blue-200",
  SHORTLISTED: "bg-amber-50 text-amber-700 border border-amber-200",
  INTERVIEW_SCHEDULED: "bg-purple-50 text-purple-700 border border-purple-200",
  SELECTED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  REJECTED: "bg-red-50 text-red-600 border border-red-200",
  WITHDRAWN: "bg-slate-100 text-slate-500 border border-slate-200",
};

const ALL_STATUSES = Object.keys(ApplicationStatus) as ApplicationStatus[];

// ────────────────────── Types ──────────────────────

interface JobMeta {
  id: string;
  title: string;
  applications: number;
  postedDate: string;
}

// ────────────────────── Helpers ──────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function fakeAiScore(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  return Math.abs(hash % 100) + 1;
}

function fakeMatchPercent(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 17 + id.charCodeAt(i)) & 0xffffffff;
  return Math.abs(hash % 100) + 1;
}

function aiScoreBarColor(score: number): string {
  if (score < 40) return "bg-red-400";
  if (score < 70) return "bg-gradient-to-r from-amber-400 to-yellow-300";
  return "bg-gradient-to-r from-emerald-400 to-green-500";
}

function formatDate(value: string | Date | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ────────────────────── Component ──────────────────────

export default function RecruiterApplication() {
  const { jobId } = useParams<{ jobId: string }>();
  const { loading, error, applications, fetchApplications } =
    useJobApplications();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "Application Date" | "Match Score" | "AI Score" | "Name"
  >("Application Date");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">(
    "All",
  );
  const [matchScoreRange, setMatchScoreRange] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const itemsPerPage = 8;

  useEffect(() => {
    if (jobId) fetchApplications(jobId);
  }, [jobId, fetchApplications]);

  // ── Derived rows ──
  const rows = useMemo(() => {
    return applications.map((app) => {
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
    });
  }, [applications]);

  // ── Filter + sort ──
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

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // ── Selection ──
  const toggleSelectAll = (checked: boolean) =>
    setSelectedRows(
      checked ? new Set(paginatedRows.map((r) => r.id)) : new Set(),
    );

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedRows(next);
  };

  const isAllSelected =
    paginatedRows.length > 0 &&
    paginatedRows.every((r) => selectedRows.has(r.id));

  const selectedCount = selectedRows.size;

  // ── Status counts ──
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

  // ────────────────────── Render ──────────────────────

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* ── Sidebar ── */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-base text-slate-900 tracking-tight">
              RecruitIQ
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <NavItem icon={<LayoutGrid size={16} />} label="Dashboard" active={false} />
          <NavItem icon={<Briefcase size={16} />} label="Jobs" active={true} />
          <NavItem icon={<Users size={16} />} label="Applications" active={false} />
          <NavItem icon={<Calendar size={16} />} label="Interviews" active={false} />
          <NavItem icon={<PhoneOff size={16} />} label="Candidates" active={false} />
          <NavItem icon={<CreditCard size={16} />} label="Billing" active={false} />
          <NavItem icon={<User size={16} />} label="Profile" active={false} />
        </nav>

        <div className="px-3 py-4 border-t border-slate-200">
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-sm w-full px-3 py-2 rounded-lg hover:bg-slate-100 transition">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <button className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition">
              <ChevronLeft size={16} />
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600 font-medium">Manage Jobs</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-semibold">Applications</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => jobId && fetchApplications(jobId)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition shadow-sm">
              <Plus size={15} />
              Create New Job
            </button>
            <button className="relative text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Job Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-5 shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 mb-1">
                {displayJob.title}
              </h1>
              <div className="flex items-center gap-5 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Users size={13} />
                  {displayJob.applications} total
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  Posted: {displayJob.postedDate}
                </span>
              </div>
            </div>
            <button className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold px-4 py-2 rounded-lg text-sm transition">
              Close Job
            </button>
          </div>

          {/* Status filter pills */}
          {!loading && !error && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => { setStatusFilter("All"); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                  statusFilter === "All"
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"
                }`}
              >
                All{" "}
                <span className="opacity-60 ml-0.5">({statusCounts.All ?? 0})</span>
              </button>
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                    statusFilter === s
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"
                  }`}
                >
                  {STATUS_LABELS[s]}{" "}
                  <span className="opacity-60 ml-0.5">({statusCounts[s] ?? 0})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter toolbar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-52"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Sort
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option>Application Date</option>
                <option>Match Score</option>
                <option>AI Score</option>
                <option>Name</option>
              </select>
            </div>

            {/* Status dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                Status
              </span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as ApplicationStatus | "All");
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="All">All Statuses</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            {/* Match score range */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wide whitespace-nowrap">
                Match ≤ {matchScoreRange}%
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={matchScoreRange}
                onChange={(e) => { setMatchScoreRange(Number(e.target.value)); setCurrentPage(1); }}
                className="w-32 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Bulk action bar */}
          {selectedCount > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-4 text-sm">
              <span className="text-slate-700 font-semibold">
                {selectedCount} selected
              </span>
              <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Move to Shortlisted
              </button>
              <button className="text-purple-600 hover:text-purple-700 font-medium hover:underline">
                Schedule Interview
              </button>
              <button className="text-red-500 hover:text-red-600 font-medium hover:underline">
                Reject
              </button>
              <button
                onClick={() => setSelectedRows(new Set())}
                className="ml-auto text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 py-5">
          {loading && (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading applications…</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <p className="text-red-500 text-sm font-medium mb-2">{error}</p>
                <button
                  onClick={() => jobId && fetchApplications(jobId)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-5 py-3.5 text-left w-10">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                      />
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Candidate
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Applied
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      AI Score
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Match
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Interview
                    </th>
                    <th className="px-5 py-3.5 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-16 text-center text-sm text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search size={24} className="opacity-30" />
                          <span>No applications match the current filters.</span>
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setStatusFilter("All");
                              setMatchScoreRange(100);
                            }}
                            className="text-blue-600 text-xs hover:underline mt-1"
                          >
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((row) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          selectedRows.has(row.id)
                            ? "bg-blue-50/60"
                            : "bg-white"
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(row.id)}
                            onChange={() => toggleSelectRow(row.id)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                          />
                        </td>

                        {/* Candidate name + email */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {row.profileImage ? (
                              <img
                                src={row.profileImage}
                                alt={row.name}
                                className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
                                {row.initials}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate">
                                {row.name}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {row.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Application date */}
                        <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                          {row.applicationDate}
                        </td>

                        {/* AI Score */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${row.scoreBarColor}`}
                                style={{ width: `${row.aiScore}%` }}
                              />
                            </div>
                            <span className="text-slate-700 font-medium tabular-nums">
                              {row.aiScore}
                            </span>
                          </div>
                        </td>

                        {/* Match % */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{ width: `${row.matchPercent}%` }}
                              />
                            </div>
                            <span className="text-slate-700 font-medium tabular-nums">
                              {row.matchPercent}%
                            </span>
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="px-5 py-4">
                          <StatusBadge status={row.status} />
                        </td>

                        {/* Interview date */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-slate-300 text-xs">—</span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <button className="text-slate-300 hover:text-slate-600 transition p-1 rounded hover:bg-slate-100">
                            <EllipsisVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <footer className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            {filteredRows.length === 0
              ? "No results"
              : `Showing ${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                  currentPage * itemsPerPage,
                  filteredRows.length,
                )} of ${filteredRows.length} applicant${filteredRows.length !== 1 ? "s" : ""}`}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-slate-500 hover:text-slate-900 font-medium text-xs disabled:opacity-30 rounded hover:bg-slate-100 transition"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
              totalPages > 7 &&
              page > 2 &&
              page < totalPages - 1 &&
              Math.abs(page - currentPage) > 1 ? (
                page === 3 || page === totalPages - 2 ? (
                  <span key={page} className="px-1 text-slate-300 text-xs">
                    …
                  </span>
                ) : null
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded flex items-center justify-center font-medium text-xs transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-slate-500 hover:text-slate-900 font-medium text-xs disabled:opacity-30 rounded hover:bg-slate-100 transition"
            >
              Next →
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ────────────────────── Sub-components ──────────────────────

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium text-sm transition ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}