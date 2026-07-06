"use client";

import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Download, Lock, X } from "lucide-react";
import { toast } from "sonner";

import { useRecruiterApplicationDetails } from "@/module/job-application/hooks/recruiter/useRecruiterApplicationDetails";
// TODO: confirm this is the actual file path for the hook you pasted — this
// follows the same convention as useRecruiterApplicationDetails above, but
// adjust if useUpdateApplicationStatus lives somewhere else.
import { useUpdateApplicationStatus } from "@/module/job-application/hooks/recruiter/useUpdateApplicationStatus";
import type { RecruiterApplicationDetails } from "@/module/job-application/types/RecruiterApplicationDetails";
import type { UpdateApplicationStatusDTO } from "@/module/job-application/types/updateApplicationStatus.dto";
import { ApplicationStatus } from "@/module/job-application/types/jobApplication.types";

// TODO: confirm this matches your resume.api export. It should accept a
// resumeId (not necessarily the current recruiter's own resume) and return
// a download URL string.
import { getResumeDownloadUrl } from "@/module/resume/api/resume.api";

// ---------------------------------------------------------------------------
// Local view-model + adapter
// ---------------------------------------------------------------------------

interface DecisionView {
  candidateName: string;
  candidateEmail?: string;
  position: string;
  aiScore: number | null;
  matchedSkills: string[];
  resumeId?: string;
  interviewType: string;
  interviewDurationMinutes: number | null;
  interviewScheduledAt: string;
  interviewStatusLabel: string;
  isInterviewCompleted: boolean;
  applicationStatus: ApplicationStatus;
}

function mapToDecisionView(app: RecruiterApplicationDetails): DecisionView {
  const a = app as any;
  const interview = a.interview ?? {};
  const analysis = a.aiAnalysis ?? {};

  const interviewStatus: string = interview.status ?? interview.state ?? "SCHEDULED";

  return {
    candidateName: a.candidateName ?? "Unknown candidate",
    candidateEmail: a.candidateEmail,
    position: a.jobTitle ?? a.position ?? "—",
    aiScore: typeof analysis.matchScore === "number" ? analysis.matchScore : analysis.score ?? null,
    matchedSkills: analysis.matchedSkills ?? analysis.skills ?? [],
    resumeId: a.resumeId,
    interviewType: interview.type ?? interview.mode ?? "Video Interview",
    interviewDurationMinutes: interview.durationMinutes ?? interview.duration ?? null,
    interviewScheduledAt: interview.scheduledAt ?? interview.startTime ?? "—",
    interviewStatusLabel: interviewStatus,
    isInterviewCompleted: String(interviewStatus).toUpperCase() === "COMPLETED",
    applicationStatus: app.status,
  };
}

function formatDate(value: string) {
  if (!value || value === "—") return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Reject modal
// ---------------------------------------------------------------------------

function RejectModal({
  reason,
  onReasonChange,
  onCancel,
  onConfirm,
  submitting,
  error,
}: {
  reason: string;
  onReasonChange: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-md">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-950">Reject candidate</h2>
          <button
            onClick={onCancel}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Optionally add a reason. This may be shared with the candidate depending on your
          workspace settings.
        </p>
        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          rows={4}
          disabled={submitting}
          placeholder="e.g. Not enough hands-on experience with the required stack"
          className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 disabled:opacity-60 mb-3"
        />
        {error && (
          <p className="text-sm text-red-600 mb-3" role="alert">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Rejecting…" : "Confirm rejection"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar (unchanged from mockup)
// ---------------------------------------------------------------------------

type NavIcon = "grid" | "briefcase" | "filetext" | "video" | "users" | "credit" | "user";

interface NavItemProps {
  icon: NavIcon;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  const iconMap: Record<NavIcon, ReactNode> = {
    grid: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    briefcase: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
    filetext: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="13" x2="12" y2="17" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    video: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    credit: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    user: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };

  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
        active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:text-gray-950 hover:bg-gray-100"
      }`}
    >
      {iconMap[icon]}
      <span>{label}</span>
    </button>
  );
}

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-screen flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-200 flex items-center gap-3">
        <div className="w-11 h-11 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shrink-0 shadow-md">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <span className="text-lg font-bold text-gray-950">RecruitQ</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <NavItem icon="grid" label="Dashboard" />
        <NavItem icon="briefcase" label="Jobs" />
        <NavItem icon="filetext" label="Applications" active />
        <NavItem icon="video" label="Interviews" />
        <NavItem icon="users" label="Candidates" />
        <NavItem icon="credit" label="Billing" />
        <NavItem icon="user" label="Profile" />
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 text-gray-600 hover:text-gray-950 font-semibold text-sm w-full transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>logout</span>
        </button>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Loading / error states
// ---------------------------------------------------------------------------

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={"animate-pulse bg-gray-200/80 rounded-md " + className} />;
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="ml-64 flex-1 overflow-auto bg-linear-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto p-10 space-y-10">
          <SkeletonBlock className="h-5 w-20" />
          <div className="space-y-3">
            <SkeletonBlock className="h-8 w-96" />
            <SkeletonBlock className="h-6 w-64" />
          </div>
          <div className="grid grid-cols-2 gap-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="ml-64 flex-1 overflow-auto bg-linear-to-b from-white to-gray-50">
        <div className="max-w-2xl mx-auto px-8 py-24 text-center">
          <h1 className="text-xl font-bold text-gray-950 mb-2">Couldn't load this application</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onRetry}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function RecruiterInterviewDecision() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  const { loading, error, application, fetchApplicationDetails } =
    useRecruiterApplicationDetails(applicationId);

  // Drives both the Select / Reject buttons and the reject modal's
  // submitting state — no more local isUpdatingStatus flag to keep in sync.
  const {
    loading: isUpdatingStatus,
    error: updateStatusError,
    updateStatus,
    clearError: clearUpdateStatusError,
  } = useUpdateApplicationStatus();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const refresh = useCallback(() => {
    if (applicationId) void fetchApplicationDetails(applicationId);
  }, [applicationId, fetchApplicationDetails]);

  const handleSelect = useCallback(async () => {
    if (!applicationId) return;

    const dto: UpdateApplicationStatusDTO = {
      applicationId,
      status: ApplicationStatus.SELECTED,
    };
    const success = await updateStatus(dto);
    if (!success) {
      toast.error("Failed to update application status");
      return;
    }
    toast.success("Candidate selected");
    refresh();
  }, [applicationId, updateStatus, refresh]);

  const handleRejectConfirm = useCallback(async () => {
    if (!applicationId) return;

    const dto: UpdateApplicationStatusDTO = {
      applicationId,
      status: ApplicationStatus.REJECTED,
      rejectionReason: rejectionReason.trim() || undefined,
    };
    const success = await updateStatus(dto);
    if (!success) {
      toast.error("Failed to update application status");
      return; // keep the modal open with the inline error so they can retry
    }
    toast.success("Candidate rejected");
    setShowRejectModal(false);
    setRejectionReason("");
    refresh();
  }, [applicationId, rejectionReason, updateStatus, refresh]);

  const handleDownloadResume = useCallback(async () => {
    if (!application?.resumeId) {
      toast.error("No resume on file for this candidate");
      return;
    }
    setIsDownloading(true);
    try {
      const url = await getResumeDownloadUrl(application.resumeId);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download resume");
    } finally {
      setIsDownloading(false);
    }
  }, [application?.resumeId]);

  function closeRejectModal() {
    if (isUpdatingStatus) return;
    setShowRejectModal(false);
    setRejectionReason("");
    clearUpdateStatusError();
  }

  function openRejectModal() {
    clearUpdateStatusError();
    setShowRejectModal(true);
  }

  if (loading && !application) {
    return <LoadingState />;
  }

  if (error && !application) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  if (!application) {
    return <LoadingState />;
  }

  const view = mapToDecisionView(application);
  const alreadyDecided =
    view.applicationStatus === ApplicationStatus.SELECTED ||
    view.applicationStatus === ApplicationStatus.REJECTED;
  const actionsDisabled = isUpdatingStatus || alreadyDecided || !view.isInterviewCompleted;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="ml-64 flex-1 overflow-auto bg-linear-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto p-10">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-950 mb-8 font-semibold text-sm transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-950 mb-2">Recruiter Interview Decision</h1>
            <p className="text-2xl">
              <span className="font-bold text-blue-600">{view.candidateName}</span>
              <span className="text-gray-600 font-semibold"> ({view.position})</span>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-10">
            <button className="px-1 py-3 text-gray-950 font-bold text-base border-b-3 border-blue-600 transition-colors">
              View Details
            </button>
            <button className="px-1 py-3 text-gray-600 hover:text-gray-950 font-semibold text-base transition-colors">
              Add Internal Note
            </button>
            <button className="px-1 py-3 text-gray-600 hover:text-gray-950 font-semibold text-base transition-colors">
              View Transcript
            </button>
          </div>

          {/* Candidate Summary Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-950 mb-8">Candidate Summary</h2>

            <div className="grid grid-cols-2 gap-12">
              <div>
                <div className="mb-10">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Candidate Name</p>
                  <p className="text-xl font-bold text-gray-950">{view.candidateName}</p>
                  {view.candidateEmail && (
                    <p className="text-sm text-gray-500 mt-1">{view.candidateEmail}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">AI Score</p>
                  {view.aiScore !== null ? (
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-black text-gray-950">{view.aiScore}%</span>
                      <span className="text-base font-semibold text-gray-600 mb-1">Match</span>
                    </div>
                  ) : (
                    <p className="text-base font-semibold text-gray-400">Not yet analyzed</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Applied for</p>
                <p className="text-xl font-bold text-gray-950 mb-8">{view.position}</p>

                <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Resume</p>
                {view.resumeId ? (
                  <button
                    onClick={handleDownloadResume}
                    disabled={isDownloading}
                    className="text-blue-600 hover:text-blue-700 font-bold text-base flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Download className="w-5 h-5" />
                    {isDownloading ? "Preparing download…" : "Download Resume"}
                  </button>
                ) : (
                  <p className="text-sm text-gray-400">No resume on file</p>
                )}
              </div>
            </div>

            {view.matchedSkills.length > 0 && (
              <div className="mt-10 pt-10 border-t border-gray-200">
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-5">Matched Skills</p>
                <div className="flex flex-wrap gap-3">
                  {view.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2.5 bg-gray-200 text-gray-950 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <hr className="my-12 border-gray-200" />

          {/* Interview Information Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-950">Interview Information</h2>
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div>
                <div className="mb-10">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Interview Type</p>
                  <p className="text-xl font-bold text-gray-950">{view.interviewType}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Duration</p>
                  <p className="text-xl font-bold text-gray-950">
                    {view.interviewDurationMinutes !== null ? `${view.interviewDurationMinutes} minutes` : "—"}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-10">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">
                    Scheduled Date & Time
                  </p>
                  <p className="text-xl font-bold text-gray-950">{formatDate(view.interviewScheduledAt)}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-3">Current Status</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                      view.isInterviewCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {view.interviewStatusLabel}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Lock / status message */}
          {alreadyDecided ? (
            <div className="flex items-center gap-4 bg-gray-100 border-2 border-gray-200 rounded-xl px-5 py-4 mb-10 shadow-sm">
              <p className="text-base text-gray-800 font-semibold">
                Decision recorded: candidate has been{" "}
                {view.applicationStatus === ApplicationStatus.SELECTED ? "selected" : "rejected"}.
              </p>
            </div>
          ) : !view.isInterviewCompleted ? (
            <div className="flex items-center gap-4 bg-blue-50 border-2 border-blue-200 rounded-xl px-5 py-4 mb-10 shadow-sm">
              <Lock className="w-6 h-6 text-blue-600 shrink-0" />
              <p className="text-base text-gray-800 font-semibold">
                Decision locked — interview session not completed.
              </p>
            </div>
          ) : null}

          {/* Inline error from the last failed status update (e.g. the Select
              action failing outside the reject modal, where there's no
              dedicated error slot). */}
          {updateStatusError && !showRejectModal && (
            <div className="flex items-center gap-4 bg-red-50 border-2 border-red-200 rounded-xl px-5 py-4 mb-6 shadow-sm">
              <p className="text-sm text-red-700 font-semibold">{updateStatusError}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSelect}
              disabled={actionsDisabled}
              className="flex-1 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              {isUpdatingStatus ? "Updating…" : "Select Candidate"}
            </button>
            <button
              onClick={openRejectModal}
              disabled={actionsDisabled}
              className="flex-1 px-6 py-3.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 active:bg-red-700 transition-all shadow-md hover:shadow-lg text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500"
            >
              Reject Candidate
            </button>
          </div>
        </div>
      </main>

      {showRejectModal && (
        <RejectModal
          reason={rejectionReason}
          onReasonChange={setRejectionReason}
          onCancel={closeRejectModal}
          onConfirm={handleRejectConfirm}
          submitting={isUpdatingStatus}
          error={updateStatusError}
        />
      )}
    </div>
  );
}