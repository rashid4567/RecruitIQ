import { useState } from "react";
import { RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { useMyApplicatons } from "../../hooks/candidate/useMyApplications";
import { useWithdrawApplication } from "../../hooks/candidate/useWithdrawApplication";
import {
  ApplicationStatus,
  type JobApplication,
} from "@/module/job-application/domain/entity/job-application.entity";
import { Sidebar } from "../component/Recruiter.application/sidebar";
import { StatsCards } from "../component/my-applications/StatsCards";
import { FilterBar } from "../component/my-applications/FilterBar";
import { ApplicationsTable } from "../component/my-applications/ApplicationsTable";
import { WithdrawModal } from "../component/my-applications/WithdrawModal";
import { Toast } from "../component/my-applications/Toast";

const PER_PAGE = 7;

export default function MyApplicationsPage() {
  const {
    application: applications,
    loading,
    error,
    refresh,
  } = useMyApplicatons();
  const { withdraw, loading: withdrawing } = useWithdrawApplication();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ApplicationStatus>(
    "ALL",
  );
  const [withdrawTarget, setWithdrawTarget] = useState<JobApplication | null>(
    null,
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filtered = applications.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = a.getJobId().toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "ALL" || a.getStatus() === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleStatusFilter = (v: string) => {
    setStatusFilter(v as "ALL" | ApplicationStatus);
    setPage(1);
  };

  const handleWithdrawConfirm = async () => {
    if (!withdrawTarget) return;
    const ok = await withdraw(withdrawTarget.getId());
    if (ok) {
      setSuccessMsg("Application withdrawn successfully.");
      setTimeout(() => setSuccessMsg(null), 5000);
      refresh();
    }
    setWithdrawTarget(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#f7f8fc]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin text-blue-500" />
            <p className="text-[13px] text-slate-500 font-medium">
              Loading your applications…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#f7f8fc]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-xs">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <p className="text-[14px] font-bold text-slate-800 mb-1">
              Could not load applications
            </p>
            <p className="text-[12px] text-slate-400 mb-5">{error}</p>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[13px] font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-200"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f7f8fc] overflow-hidden">
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
            <h1 className="text-[16px] font-extrabold text-slate-900 tracking-tight leading-none">
              My Applications
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Track and manage all your job applications
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Toast message={successMsg} onDismiss={() => setSuccessMsg(null)} />

            <button
              onClick={refresh}
              className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition text-slate-400 hover:text-slate-700"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>

            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition shadow-sm shadow-blue-300">
              Apply to Jobs
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-0">
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
              page={page}
              perPage={PER_PAGE}
              onPageChange={setPage}
            />

            <p className="text-[10px] text-slate-300 pt-3 text-center font-medium">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              {statusFilter !== "ALL" && <> · Status filter active</>}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
