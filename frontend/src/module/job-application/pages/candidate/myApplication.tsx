import { useState } from "react";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMyApplications } from "../../hooks/candidate/useMyApplications";
import { useWithdrawApplication } from "../../hooks/candidate/useWithdrawApplication";
import { ApplicationStatus } from "../../types/jobApplication.types";
import Sidebar from "../../../candidate/pages/components/personalInfo/shared/candidateSidebar";
import { StatsCards } from "../component/candidate-applications/StatsCards";
import { FilterBar } from "../component/candidate-applications/FilterBar";
import { ApplicationsTable } from "../component/candidate-applications/ApplicationsTable";
import { WithdrawModal } from "../component/candidate-applications/WithdrawModal";
import { Toast } from "../component/candidate-applications/Toast";
import { RefreshCw, Search } from "lucide-react";
import type { CandidateApplication } from "../../types/application.types";
import Header from "@/module/auth/pages/home/header";

const PER_PAGE = 7;

export default function MyApplicationsPage() {
  const navigate = useNavigate();

  const { applications, loading, error, refresh } = useMyApplications();
  const { withdraw, loading: withdrawing } = useWithdrawApplication();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ApplicationStatus>(
    "ALL",
  );
  const [withdrawTarget, setWithdrawTarget] =
    useState<CandidateApplication | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const normalizedQuery = search.trim().toLowerCase();

  const filtered = applications.filter((a) => {
    const matchSearch =
      !normalizedQuery ||
      (a.jobTitle ?? "").toLowerCase().includes(normalizedQuery);

    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;

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

  const renderBody = () => {
    if (loading) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={26} className="animate-spin text-blue-500" />
            <p className="text-[13px] text-slate-500">
              Loading your applications…
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-xs text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-red-100 bg-red-50">
              <AlertCircle size={20} className="text-red-400" />
            </div>
            <p className="mb-1 text-[14px] font-medium text-slate-800">
              Could not load applications
            </p>
            <p className="mb-5 text-[12px] text-slate-400">{error}</p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-[13px] font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Retrying…" : "Try again"}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-5">
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

        <div
          className="
            flex flex-col gap-3
            pt-1
            sm:flex-row sm:items-center sm:justify-between
          "
        >
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
            <>
              <div className="flex items-center justify-between sm:hidden">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </button>

                <span className="text-xs font-medium text-slate-500">
                  Page {safePage} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="hidden items-center gap-1 sm:flex">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </button>

                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="flex size-8 select-none items-center justify-center text-[12px] text-slate-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`size-8 rounded-lg border text-[12px] font-medium transition ${
                        safePage === p
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-dvh bg-slate-50">
      <Header />

      {withdrawTarget && (
        <WithdrawModal
          app={withdrawTarget}
          onConfirm={handleWithdrawConfirm}
          onCancel={() => setWithdrawTarget(null)}
          loading={withdrawing}
        />
      )}

      {successMsg && (
        <Toast message={successMsg} onDismiss={() => setSuccessMsg(null)} />
      )}

      <div className="flex">
        <aside className="hidden lg:block lg:shrink-0">
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1">
          <header
            className="
              border-b border-slate-200/70
              bg-white
              px-3 py-3
              min-[375px]:px-4
              sm:px-6 sm:py-4
              lg:px-8
            "
          >
            <div
              className="
                mx-auto
                flex w-full max-w-400
                flex-col gap-3
                min-[400px]:flex-row
                min-[400px]:items-center
                min-[400px]:justify-between
              "
            >
              <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  My Applications
                </h1>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Track and manage all your job applications
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  title="Refresh"
                  aria-label="Refresh applications"
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={refreshing ? "animate-spin" : ""}
                  />
                </button>

                <button
                  onClick={() => navigate("/candidate/jobs")}
                  className="
                    inline-flex min-h-10
                    flex-1 items-center justify-center gap-2
                    rounded-xl bg-blue-600
                    px-4
                    text-sm font-semibold text-white
                    transition hover:bg-blue-700
                    min-[400px]:flex-none
                  "
                >
                  <Search size={15} />
                  Browse jobs
                </button>
              </div>
            </div>
          </header>

          <div
            className="
              mx-auto
              w-full
              max-w-400
              px-3 py-4
              min-[375px]:px-4
              sm:px-6 sm:py-5
              lg:px-8 lg:py-6
            "
          >
            {renderBody()}
          </div>
        </main>
      </div>
    </div>
  );
}
