import { useState } from "react";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMyApplications } from "../../hooks/candidate/useMyApplications";
import { useWithdrawApplication } from "../../hooks/candidate/useWithdrawApplication";
import {
  ApplicationStatus,
} from "../../types/jobApplication.types"
import Sidebar from "../../../candidate/pages/components/personalInfo/shared/candidateSidebar"
import { StatsCards } from "../component/candidate-applications/StatsCards";
import { FilterBar } from "../component/candidate-applications/FilterBar";
import { ApplicationsTable } from "../component/candidate-applications/ApplicationsTable";
import { WithdrawModal } from "../component/candidate-applications/WithdrawModal";
import { Toast } from "../component/candidate-applications/Toast";
import { RefreshCw, Search } from "lucide-react";
import type { CandidateApplication } from "../../types/application.types";

const PER_PAGE = 7;

export default function MyApplicationsPage() {
  const navigate = useNavigate();

 const {
  applications,
  loading,
  error,
  refresh,
} = useMyApplications();

  const { withdraw, loading: withdrawing } = useWithdrawApplication();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ApplicationStatus>(
    "ALL",
  );
  const [withdrawTarget, setWithdrawTarget] = useState<CandidateApplication | null>(
    null,
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

const filtered = applications.filter((a) => {
  const q = search.toLowerCase();

  const matchSearch = (a.jobTitle ?? "")
    .toLowerCase()
    .includes(q);

  const matchStatus =
    statusFilter === "ALL" || a.status === statusFilter;

  return matchSearch && matchStatus;
});

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const delta = 1;
    const range: number[] = [];

    for (
      let i = Math.max(2, safePage - delta);
      i <= Math.min(totalPages - 1, safePage + delta);
      i++
    ) {
      range.push(i);
    }

    pages.push(1);
    if (range[0] > 2) pages.push("...");
    pages.push(...range);
    if (range[range.length - 1] < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleStatusFilter = (v: string) => {
    setStatusFilter(v as "ALL" | ApplicationStatus);
    setPage(1);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  const handleWithdrawConfirm = async () => {
    if (!withdrawTarget) return;
    const ok = await withdraw(withdrawTarget.applicationId);
    if (ok) {
      setSuccessMsg("Application withdrawn successfully.");
      setTimeout(() => setSuccessMsg(null), 5000);
      await handleRefresh();
    }
    setWithdrawTarget(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={26} className="animate-spin text-blue-500" />
            <p className="text-[13px] text-slate-500">
              Loading your applications…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-xs">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={20} className="text-red-400" />
            </div>
            <p className="text-[14px] font-medium text-slate-800 mb-1">
              Could not load applications
            </p>
            <p className="text-[12px] text-slate-400 mb-5">{error}</p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-[13px] font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Retrying…" : "Try again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      {withdrawTarget && (
        <WithdrawModal
          app={withdrawTarget}
          onConfirm={handleWithdrawConfirm}
          onCancel={() => setWithdrawTarget(null)}
          loading={withdrawing}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-[15px] font-medium text-slate-900 tracking-tight">
              My applications
            </h1>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Track and manage all your job applications
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Toast message={successMsg} onDismiss={() => setSuccessMsg(null)} />
            <div className="w-px h-5 bg-slate-100" />
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh"
              aria-label="Refresh applications"
              className="w-8.5 h-8.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={() => navigate("/candidate/jobs")}
              className="flex items-center gap-1.5 h-8.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-lg transition"
            >
              <Search size={13} />
              Browse jobs
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-4">
            <StatsCards apps={applications} />

            <FilterBar
              search={search}
              onSearch={handleSearch}
              statusFilter={statusFilter}
              onStatusFilter={handleStatusFilter}
            />

            <ApplicationsTable
              applications={filtered}
              onWithdraw={setWithdrawTarget}
              page={safePage}
              perPage={PER_PAGE}
              onPageChange={setPage}
            />

            <div className="flex items-center justify-between pt-1">
              {/* Result count */}
              <p className="text-[12px] text-slate-400">
                Showing{" "}
                <span className="font-medium text-slate-600">
                  {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–
                  {Math.min(safePage * PER_PAGE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-600">
                  {filtered.length}
                </span>{" "}
                application{filtered.length !== 1 ? "s" : ""}
                {statusFilter !== "ALL" && (
                  <span className="ml-1.5 text-blue-500">· filtered</span>
                )}
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="w-8 h-8 flex items-center justify-center text-[12px] text-slate-400 select-none"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-[12px] font-medium transition border ${
                          safePage === p
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
