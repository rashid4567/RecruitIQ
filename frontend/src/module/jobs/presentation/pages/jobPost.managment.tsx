import { useState } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/admin/sideBar";
import type { Job } from "../../domain/entity/jobPost.entity";
import { useAllJobPosts } from "../hooks/jobPost-Hooks/useAllJobpost";
import { useUpdateJobPostStatus } from "../hooks/jobPost-Hooks/Useupdatejobpoststatus";
import { JobPostHeader } from "./components/admin.job.management/Jobpostheader";
import { JobPostFilters } from "./components/admin.job.management/Jobpostfilters";
import { EmptyState } from "./components/admin.job.management/Emptystate";
import { JobPostTable } from "./components/admin.job.management/Jobposttable";
import { JobPostDetailModal } from "./components/admin.job.management/Jobpostdetailmodal";
import { BlockConfirmDialog } from "./components/admin.job.management/Blockconfirmdialog";

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

  if (error) toast.error(error);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30 flex">
      <Sidebar />

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

            {!loading && jobPosts.length === 0 ? (
              <EmptyState onRefresh={refresh} />
            ) : (
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
              />
            )}
          </div>
        </main>
      </div>

      <JobPostDetailModal
        job={selectedJob}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onToggleBlock={handleToggleBlock}
      />

      <BlockConfirmDialog
        job={jobToBlock}
        isOpen={isBlockDialogOpen}
        onClose={handleCloseBlockDialog}
        onConfirm={handleConfirmToggleBlock}
        loading={blockLoading}
      />
    </div>
  );
}
