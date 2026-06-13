import {
  MapPin,
  Clock,
  EyeOff,
  Eye,
  Share2,
  Briefcase,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { JobCardProps } from "@/module/jobs/presentation/types/jobCard.types";
import { useRecruiterJobActions } from "../../../hooks/Recruiter-jobPost/useJobActions";
import { useDeleteJobPost } from "../../../hooks/Recruiter-jobPost/useDeleteJopPost";

type StatusKey = "Active" | "Paused" | "Expired" | "Draft" | "Blocked";

interface StatusStyle {
  bg: string;
  text: string;
  dot: string;
  border: string;
  label: string;
}

const statusConfig: Record<StatusKey, StatusStyle> = {
  Active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
    label: "Active",
  },
  Paused: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200",
    label: "Paused",
  },
  Expired: {
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
    border: "border-red-200",
    label: "Expired",
  },
  Draft: {
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
    border: "border-gray-200",
    label: "Draft",
  },
  Blocked: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    border: "border-rose-200",
    label: "Blocked",
  },
};

function resolveStatusKey(
  isBlocked: boolean,
  jobStatus: JobCardProps["status"],
): StatusKey {
  if (isBlocked) return "Blocked";
  if (jobStatus in statusConfig) return jobStatus as StatusKey;
  return "Draft";
}

function ModalShell({
  onBackdropClick,
  children,
}: {
  onBackdropClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onBackdropClick}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ConfirmDeleteModal({
  jobTitle,
  onConfirm,
  onCancel,
  deleting,
}: {
  jobTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deleting) onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel, deleting]);

  return (
    <ModalShell onBackdropClick={() => !deleting && onCancel()}>
      <button
        onClick={onCancel}
        disabled={deleting}
        className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-2xl mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>

      <h3 className="text-base font-bold text-gray-900 text-center mb-1">
        Delete Job Post?
      </h3>
      <p className="text-sm text-gray-500 text-center mb-1">
        You're about to delete
      </p>
      <p className="text-sm font-semibold text-gray-800 text-center mb-3 line-clamp-2 px-2">
        "{jobTitle}"
      </p>
      <p className="text-xs text-gray-400 text-center mb-6">
        This action cannot be undone. All associated data will be permanently
        removed.
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={deleting}
          className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
        >
          {deleting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Delete
            </>
          )}
        </button>
      </div>
    </ModalShell>
  );
}

function ConfirmVisibilityModal({
  jobTitle,
  isHidden,
  onConfirm,
  onCancel,
  loading,
}: {
  jobTitle: string;
  isHidden: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel, loading]);

  const action = isHidden ? "unhide" : "hide";
  const ActionIcon = isHidden ? Eye : EyeOff;

  const iconWrapperClass = isHidden ? "bg-emerald-50" : "bg-amber-50";
  const iconClass = isHidden ? "text-emerald-500" : "text-amber-500";

  const confirmBtnClass = isHidden
    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25"
    : "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25";

  const description = isHidden
    ? "Candidates will be able to see and apply to this job again."
    : "Candidates won't be able to see or apply to this job until you unhide it.";

  return (
    <ModalShell onBackdropClick={() => !loading && onCancel()}>
      <button
        onClick={onCancel}
        disabled={loading}
        className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <X className="w-4 h-4" />
      </button>

      <div
        className={`flex items-center justify-center w-12 h-12 ${iconWrapperClass} rounded-2xl mx-auto mb-4`}
      >
        <ActionIcon className={`w-6 h-6 ${iconClass}`} />
      </div>

      <h3 className="text-base font-bold text-gray-900 text-center mb-1 capitalize">
        {isHidden ? "Unhide" : "Hide"} Job Post?
      </h3>
      <p className="text-sm text-gray-500 text-center mb-1">
        You're about to {action}
      </p>
      <p className="text-sm font-semibold text-gray-800 text-center mb-3 line-clamp-2 px-2">
        "{jobTitle}"
      </p>
      <p className="text-xs text-gray-400 text-center mb-6">{description}</p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 py-2.5 px-4 rounded-xl text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg ${confirmBtnClass}`}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isHidden ? "Unhiding..." : "Hiding..."}
            </>
          ) : (
            <>
              <ActionIcon className="w-4 h-4" />
              {isHidden ? "Unhide" : "Hide"}
            </>
          )}
        </button>
      </div>
    </ModalShell>
  );
}

export default function JobCard({
  job,
  onViewClick,
  onJobUpdated,
  onJobDeleted,
}: {
  job: JobCardProps;
  onViewClick: (job: JobCardProps) => void;
  onJobUpdated?: (updated: JobCardProps) => void;
  onJobDeleted?: (id: string) => void;
}) {
  const { toggleHide, loading } = useRecruiterJobActions();
  const { deleteJobPost, loading: deleting } = useDeleteJobPost();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);

  const isHidden = job.visibility === "hidden";
  const isBlocked = job.isBlocked;
  const isExpired = job.status === "Expired";
  const canToggleVisibility = !isBlocked && !isExpired;

  const statusKey = resolveStatusKey(isBlocked, job.status);
  const status = statusConfig[statusKey];

  const handleShare = async (): Promise<void> => {
    try {
      const shareUrl = `${window.location.origin}/candidate/jobs?jobId=${job.id}`;
      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: `${job.title} at ${job.companyName}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Job link copied to clipboard");
      }
    } catch (err) {
      console.error("Failed to share job:", err);
    }
  };

  const handleConfirmVisibility = async (): Promise<void> => {
    await toggleHide(job, onJobUpdated);
    setShowVisibilityModal(false);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    const success = await deleteJobPost(job.id);
    if (success) {
      setShowDeleteModal(false);
      onJobDeleted?.(job.id);
    }
  };

  return (
    <>
      <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-100/60 hover:border-blue-100 transition-all duration-300">
        <div
          className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-300 ${
            isBlocked
              ? "bg-rose-400"
              : isExpired
                ? "bg-red-400"
                : isHidden
                  ? "bg-amber-400"
                  : "bg-linear-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100"
          }`}
        />

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg tracking-wide uppercase">
              <Briefcase className="w-3 h-3" />
              {job.category}
            </span>

            <div className="flex items-center gap-1.5">
              {isHidden && !isBlocked && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg border bg-amber-50 text-amber-700 border-amber-200">
                  <EyeOff className="w-3 h-3" />
                  Hidden
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border ${status.bg} ${status.text} ${status.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>
          </div>

          {isBlocked && (
            <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
              <span>⚠️</span>
              <span>This job has been blocked by admin</span>
            </div>
          )}
          {isExpired && !isBlocked && (
            <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              <span>🕒</span>
              <span>This posting has expired</span>
            </div>
          )}
          {isHidden && !isBlocked && !isExpired && (
            <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-600 font-medium">
              <EyeOff className="w-3.5 h-3.5" />
              <span>This job is hidden from candidates</span>
            </div>
          )}

          <h3 className="text-base font-bold text-gray-900 mb-0.5 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
            {job.title}
          </h3>
          <p className="text-sm text-gray-400 mb-4 font-medium">
            {job.companyName}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-5">
            <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {job.jobType}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100/60 rounded-xl p-3.5 text-center">
              <p className="text-2xl font-extrabold text-blue-700 leading-none mb-0.5">
                {job.applications}
              </p>
              <p className="text-[11px] font-medium text-blue-500 uppercase tracking-wide">
                Applications
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-center">
              <p className="text-2xl font-extrabold text-gray-800 leading-none mb-0.5">
                {job.views}
              </p>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                Views
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onViewClick(job)}
              className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] transition-all duration-200"
            >
              Quick View
            </button>

            {canToggleVisibility ? (
              <button
                onClick={() => setShowVisibilityModal(true)}
                disabled={loading}
                title={isHidden ? "Unhide Job" : "Hide Job"}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border font-semibold text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isHidden
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300"
                    : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300"
                }`}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isHidden ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Unhide</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                title={
                  isBlocked
                    ? "Blocked by admin"
                    : "Expired — cannot change visibility"
                }
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-xs font-semibold cursor-not-allowed opacity-50"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide</span>
              </button>
            )}

            <button
              onClick={handleShare}
              title="Share Job"
              className="p-2.5 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
            >
              <Share2 className="w-4 h-4 text-blue-500" />
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              title="Delete Job"
              className="p-2.5 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 text-gray-400 hover:text-red-500 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showVisibilityModal && (
        <ConfirmVisibilityModal
          jobTitle={job.title}
          isHidden={isHidden}
          loading={loading}
          onConfirm={handleConfirmVisibility}
          onCancel={() => !loading && setShowVisibilityModal(false)}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          jobTitle={job.title}
          deleting={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
