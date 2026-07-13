import { useState } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/admin/sideBar";
import type { Job } from "../types/job.types";
import { useAllJobPosts } from "../hooks/jobPost-Hooks/useAllJobpost";
import { useUpdateJobPostStatus } from "../hooks/jobPost-Hooks/Useupdatejobpoststatus";
import { JobPostHeader } from "./components/admin.job.management/Jobpostheader";
import { JobPostFilters } from "./components/admin.job.management/Jobpostfilters";
import { JobPostTable } from "./components/admin.job.management/Jobposttable";
import { JobPostDetailModal } from "./components/admin.job.management/Jobpostdetailmodal";
import { CommonConfirmDialog } from "@/shared/Commonconfirmdialog";
import { ImpactList } from "@/shared/ImpactList";
import { Ban, ShieldCheck } from "lucide-react";

const LIMIT = 10;

export default function JobPostManagement() {
  const {
    jobPosts,
    total,
    loading,
    error,
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    refresh,
    totalPages,
  } = useAllJobPosts({ limit: LIMIT });

  const {
    pendingId,
    toggleBlock,
    loading: blockLoading,
  } = useUpdateJobPostStatus({
    onSuccess: (_, isBlocked) => {
      toast.success(isBlocked ? "Job post blocked" : "Job post unblocked");
      refresh();
    },
    onError: (msg) => toast.error(msg),
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [jobToBlock, setJobToBlock] = useState<Job | null>(null);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const isBlocking = jobToBlock?.isBlocked === false;

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsDetailOpen(true);
  };

  const handleToggleBlock = (job: Job) => {
    setJobToBlock(job);
    setIsBlockDialogOpen(true);
  };

  const handleConfirmToggleBlock = async () => {
    if (!jobToBlock) return;
    await toggleBlock(jobToBlock.id, jobToBlock.isBlocked);
    setIsBlockDialogOpen(false);
    setJobToBlock(null);
  };

  const handleCloseBlockDialog = () => {
    setIsBlockDialogOpen(false);
    setJobToBlock(null);
  };

  const dialogConfig = {
    block: {
      title: "Block Job Post",
      description: `Block "${jobToBlock?.title}"? This job will no longer be visible to candidates.`,
      icon: <Ban />,
      variant: "danger" as const,
      confirmText: "Block",
      loadingText: "Blocking...",
      label: "Impact",
      items: [
        "Job becomes hidden",
        "Candidates cannot apply",
        "Recruiter can restore later",
      ],
    },
    unblock: {
      title: "Unblock Job Post",
      description: `Restore "${jobToBlock?.title}" and make it visible again.`,
      icon: <ShieldCheck />,
      variant: "success" as const,
      confirmText: "Restore",
      loadingText: "Restoring...",
      label: "Benefit",
      items: [
        "Job becomes visible",
        "Applications accepted again",
        "Recruiter regains visibility",
      ],
    },
  };

  const current =
    jobToBlock == null
      ? null
      : isBlocking
        ? dialogConfig.block
        : dialogConfig.unblock;

  if (error) toast.error(error);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30 flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <JobPostHeader />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-5">
            <JobPostFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              total={total}
              loading={loading}
              onRefresh={refresh}
            />

            <JobPostTable
              jobs={jobPosts}
              total={total}
              page={page}
              limit={LIMIT}
              totalPages={totalPages}
              loading={loading}
              pendingId={pendingId}
              onPageChange={setPage}
              onToggleBlock={handleToggleBlock}
              onViewJob={handleViewJob}
              onRefresh={refresh}
            />
          </div>
        </main>
      </div>

      <JobPostDetailModal
        job={selectedJob}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onToggleBlock={handleToggleBlock}
      />

      {current && (
        <CommonConfirmDialog
          open={isBlockDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseBlockDialog();
          }}
          icon={current.icon}
          title={current.title}
          description={current.description}
          variant={current.variant}
          confirmText={current.confirmText}
          loading={blockLoading}
          loadingText={current.loadingText}
          onConfirm={async () => {
            await handleConfirmToggleBlock();
          }}
        >
          <ImpactList
            tone={current.variant}
            label={current.label}
            items={current.items}
          />
        </CommonConfirmDialog>
      )}
    </div>
  );
}
