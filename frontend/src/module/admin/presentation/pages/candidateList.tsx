import { useState } from "react";
import { Search, Download, Users, RefreshCw, X } from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCandidates } from "../hooks/Candidate-Hooks/useCandidate";
import { useUserStatus } from "../hooks/Candidate-Hooks/useUserStatus";
import { CandidateTable } from "../components/candidatelist/CandidateTable";
import { CandidateStatusDialog } from "../components/candidatelist/CandidateStatusDialog";

export default function CandidateManagement() {
  const navigate = useNavigate();

  const {
    candidates,
    loading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    refresh,
    changePage,
    changeLimit,
  } = useCandidates();

  const { toggleUserStatus, loadingMap } = useUserStatus({
    onSuccess: () => {
      refresh();
    },
  });

  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    candidateId: string;
    candidateName: string;
    action: "block" | "unblock";
  }>({ open: false, candidateId: "", candidateName: "", action: "block" });

  const handleToggleStatus = (
    candidateId: string,
    candidateName: string,
    action: "block" | "unblock",
  ) => {
    setConfirmationDialog({
      open: true,
      candidateId,
      candidateName,
      action,
    });
  };

  const confirmStatusToggle = async () => {
    const { candidateId, action, candidateName } = confirmationDialog;
    if (!candidateId) return;

    try {
      const isCurrentlyActive = action === "block";
      await toggleUserStatus(candidateId, isCurrentlyActive);

      toast.success(
        action === "block"
          ? `${candidateName} has been blocked`
          : `${candidateName} has been unblocked`,
      );

      setConfirmationDialog({
        open: false,
        candidateId: "",
        candidateName: "",
        action: "block",
      });
    } catch (err: any) {
      toast.error(err?.message || `Failed to ${action} candidate`);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200/70 sticky top-0 z-40 px-6 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Candidates
                </h1>
                <p className="text-sm text-slate-500">
                  Review and manage all registered candidates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-sm"
                onClick={refresh}
                disabled={loading}
              >
                <RefreshCw
                  className={cn("mr-1.5 h-4 w-4", loading && "animate-spin")}
                />
                Refresh
              </Button>
              <Button
                size="sm"
                className="h-9 px-3 text-sm bg-indigo-600 hover:bg-indigo-700 gap-1.5"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="sticky top-18 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <Input
                placeholder="Search by name, email, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-10 pr-10 bg-white shadow-sm border-slate-200 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-400 rounded-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {(["All", "Active", "Blocked"] as const).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={filterStatus === status ? "default" : "outline"}
                  className={cn(
                    "h-9 px-4 text-sm font-medium transition-all duration-200",
                    filterStatus === status
                      ? status === "All"
                        ? "bg-slate-800 hover:bg-slate-900"
                        : status === "Active"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-rose-600 hover:bg-rose-700"
                      : "border-slate-200 hover:bg-slate-50",
                  )}
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {error ? (
              <Card className="border-rose-200 bg-rose-50/50 shadow-sm rounded-xl">
                <CardContent className="p-8 text-center">
                  <h2 className="text-xl font-semibold text-rose-900 mb-2">
                    Something went wrong
                  </h2>
                  <p className="text-sm text-rose-700 mb-6">{error}</p>
                  <Button
                    size="sm"
                    onClick={refresh}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <CandidateTable
                candidates={candidates}
                loading={loading}
                pagination={pagination}
                loadingMap={loadingMap}
                onPageChange={changePage}
                onLimitChange={changeLimit}
                onRefresh={refresh}
                onToggleStatus={handleToggleStatus}
                onViewProfile={(candidateId) =>
                  navigate(`/admin/candidates/${candidateId}`)
                }
              />
            )}
          </div>
        </main>

        {/* Confirmation Dialog */}
        <CandidateStatusDialog
          open={confirmationDialog.open}
          candidateName={confirmationDialog.candidateName}
          action={confirmationDialog.action}
          loading={Object.values(loadingMap).some(Boolean)}
          onOpenChange={(open) =>
            !open &&
            setConfirmationDialog({ ...confirmationDialog, open: false })
          }
          onConfirm={confirmStatusToggle}
        />
      </div>
    </div>
  );
}
