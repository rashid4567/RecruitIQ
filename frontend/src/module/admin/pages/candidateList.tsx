import { useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCandidates } from "../hooks/Candidate-Hooks/useCandidate";
import { useUserStatus } from "../hooks/Candidate-Hooks/useUserStatus";
import { CandidateTable } from "./components/candidatelist/CandidateTable";
import { CommonConfirmDialog } from "@/shared/Commonconfirmdialog";
import { ImpactList } from "@/shared/ImpactList";
import { ManagementHeader } from "@/shared/table/ManagementHeader";
import { SearchFilterBar } from "@/shared/table/SearchFilterBar";
import { ErrorCard } from "@/shared/table/ErrorCard";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const STATUS_FILTERS = [
  {
    label: "All",
    value: "All" as const,
    activeClassName: "bg-slate-800 hover:bg-slate-900",
  },
  {
    label: "Active",
    value: "Active" as const,
    activeClassName: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    label: "Blocked",
    value: "Blocked" as const,
    activeClassName: "bg-rose-600 hover:bg-rose-700",
  },
];

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
    onSuccess: () => refresh(),
  });

  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    candidateId: string;
    candidateName: string;
    action: "block" | "unblock";
  }>({ open: false, candidateId: "", candidateName: "", action: "block" });

  const isBlock = confirmationDialog.action === "block";

  const handleToggleStatus = (
    candidateId: string,
    candidateName: string,
    action: "block" | "unblock",
  ) => {
    setConfirmationDialog({ open: true, candidateId, candidateName, action });
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
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : `Failed to ${action} candidate`;
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 flex">
        <div className="hidden lg:block">
        <Sidebar />
    </div>


      <div className="flex-1 flex flex-col">
        <ManagementHeader
          title="Candidates"
          description="Review and manage all registered candidates"
          onRefresh={refresh}
          loading={loading}
        />

        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by name, email, skills..."
          filters={STATUS_FILTERS}
          activeFilter={filterStatus}
          onFilterChange={setFilterStatus}
        />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {error ? (
              <ErrorCard message={error} onRetry={refresh} />
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

        <CommonConfirmDialog
          open={confirmationDialog.open}
          onOpenChange={(open) => {
            if (!open) {
              setConfirmationDialog({
                open: false,
                candidateId: "",
                candidateName: "",
                action: "block",
              });
            }
          }}
          icon={isBlock ? <ShieldAlert /> : <ShieldCheck />}
          title={isBlock ? "Block this candidate?" : "Unblock this candidate?"}
          description={
            <>
              <span className="font-medium text-gray-700">
                {confirmationDialog.candidateName}
              </span>{" "}
              {isBlock
                ? "will be restricted from accessing the platform."
                : "will regain full platform access."}
            </>
          }
          variant={isBlock ? "danger" : "success"}
          confirmText={isBlock ? "Block" : "Unblock"}
          loading={Object.values(loadingMap).some(Boolean)}
          loadingText={isBlock ? "Blocking..." : "Unblocking..."}
          onConfirm={confirmStatusToggle}
        >
          <ImpactList
            tone={isBlock ? "danger" : "success"}
            label={isBlock ? "Impact" : "Benefit"}
            items={
              isBlock
                ? [
                    "Notifications will be suspended",
                    "Job feed access restricted",
                    "Applications blocked",
                  ]
                : [
                    "Notifications restored",
                    "Job opportunities visible",
                    "Applications enabled",
                  ]
            }
          />
        </CommonConfirmDialog>
      </div>
    </div>
  );
}
