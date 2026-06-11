import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Edit3,
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  CalendarDays,
  Star,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Users,
  Eye,
  Briefcase,
  Layers,
  GraduationCap,
  ListChecks,
  Sparkles,
  AlertTriangle,
  Loader2,
  Wifi,
  TrendingUp,
  Award,
  ChevronRight,
  Ban,
} from "lucide-react";
import type { JobCardProps } from "../../../types/jobCard.types";
import { useDeleteJobPost } from "../../../hooks/Recruiter-jobPost/useDeleteJopPost";

type JobStatus = "Active" | "Paused" | "Expired" | "Draft" | "Blocked";

const statusConfig: Record<
  JobStatus,
  {
    bg: string;
    text: string;
    dot: string;
    badge: string;
    icon: React.ReactNode;
  }
> = {
  Active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    badge: "border-emerald-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Paused: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    badge: "border-amber-200",
    icon: <Clock className="w-3 h-3" />,
  },
  Expired: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    badge: "border-red-200",
    icon: <XCircle className="w-3 h-3" />,
  },
  Draft: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    badge: "border-gray-200",
    icon: <Edit3 className="w-3 h-3" />,
  },
  Blocked: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-600",
    badge: "border-rose-200",
    icon: <Ban className="w-3 h-3" />,
  },
};

const applicantStatusConfig: Record<
  string,
  { bg: string; text: string; label: string; dot: string }
> = {
  pending: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Pending",
    dot: "bg-gray-400",
  },
  shortlisted: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    label: "Shortlisted",
    dot: "bg-emerald-500",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Rejected",
    dot: "bg-red-500",
  },
  interviewed: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Interviewed",
    dot: "bg-blue-500",
  },
};

type DeleteState = "idle" | "confirm" | "deleting" | "error";

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
      <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
        {icon}
      </span>
      {children}
    </h3>
  );
}

export default function QuickViewModal({
  job,
  isOpen,
  onClose,
  onDeleted,
  activeTab,
  setActiveTab,
}: {
  job: JobCardProps | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: (id: string) => void;
  activeTab: "overview" | "applicants";
  setActiveTab: (tab: "overview" | "applicants") => void;
}) {
  const navigate = useNavigate();
  const { deleteJobPost, loading } = useDeleteJobPost();

  const [deleteState, setDeleteState] = useState<DeleteState>("idle");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!isOpen || !job) return null;

  const rawStatus = job.status as string;
  const status = statusConfig[rawStatus as JobStatus] ?? statusConfig.Draft;

  const conversionRate =
    job.views > 0 ? ((job.applications / job.views) * 100).toFixed(1) : "0.0";

  const handleEdit = () => {
    onClose();
    navigate(`/recruiter/job-editor/${job.id}`);
  };
  const handleDeleteClick = () => {
    setDeleteError(null);
    setDeleteState("confirm");
  };
  const handleDeleteCancel = () => {
    setDeleteState("idle");
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    setDeleteState("deleting");
    setDeleteError(null);
    const success = await deleteJobPost(job.id);
    if (success) {
      onDeleted?.(job.id);
      onClose();
    } else {
      setDeleteError("Failed to delete job. Please try again.");
      setDeleteState("error");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 transition-opacity"
        onClick={onClose}
      />

      <div
        className="fixed right-0 top-0 h-full w-full max-w-170 bg-white shadow-2xl z-50 flex flex-col"
        style={{ animation: "drawerSlideIn 0.28s cubic-bezier(0.32,0.72,0,1)" }}
      >
        <div className="relative px-7 pt-7 pb-5 border-b border-gray-100 shrink-0">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-500 via-violet-500 to-blue-500" />

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-100 to-violet-100 flex items-center justify-center shrink-0 mt-0.5">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-1.5 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border ${status.bg} ${status.text} ${status.badge}`}
                >
                  {status.icon}
                  {job.status}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200">
                  {job.category}
                </span>
                {job.isRemote && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-lg border border-violet-100">
                    <Wifi className="w-3 h-3" /> Remote
                  </span>
                )}
                {job.positions > 1 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-lg border border-orange-100">
                    <Users className="w-3 h-3" /> {job.positions} openings
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>

              <p className="text-sm text-gray-500 mb-4">{job.companyName}</p>

              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
                {[
                  {
                    icon: <MapPin className="w-3.5 h-3.5" />,
                    val: job.location,
                  },
                  { icon: <Clock className="w-3.5 h-3.5" />, val: job.jobType },
                  {
                    icon: <DollarSign className="w-3.5 h-3.5" />,
                    val: job.salary,
                  },
                  {
                    icon: <GraduationCap className="w-3.5 h-3.5" />,
                    val: `${job.experienceMin}–${job.experienceMax} yrs`,
                  },
                ].map(({ icon, val }, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-xs text-gray-500 capitalize"
                  >
                    <span className="text-gray-400">{icon}</span>
                    {val}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all shrink-0"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <div className="flex gap-0 border-b border-gray-100 px-7 bg-white shrink-0">
          {(["overview", "applicants"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-1 py-3.5 mr-6 text-sm font-semibold transition-all capitalize ${
                activeTab === tab
                  ? "text-indigo-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === "applicants" ? (
                <span className="flex items-center gap-2">
                  Applicants
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                      activeTab === "applicants"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {job.applicants?.length ?? job.applications}
                  </span>
                </span>
              ) : (
                "Overview"
              )}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="p-7 space-y-7">
              <div className="grid grid-cols-4 gap-3">
                {[
                  {
                    icon: <Eye className="w-4 h-4" />,
                    value: job.views,
                    label: "Views",
                    color: "text-blue-600 bg-blue-50",
                  },
                  {
                    icon: <Users className="w-4 h-4" />,
                    value: job.applications,
                    label: "Applied",
                    color: "text-indigo-600 bg-indigo-50",
                  },
                  {
                    icon: <Award className="w-4 h-4" />,
                    value: job.shortlisted,
                    label: "Shortlisted",
                    color: "text-violet-600 bg-violet-50",
                  },
                  {
                    icon: <Sparkles className="w-4 h-4" />,
                    value: `${job.avgAiScore}%`,
                    label: "Avg AI Score",
                    color: "text-amber-600 bg-amber-50",
                  },
                ].map(({ icon, value, label, color }) => (
                  <div
                    key={label}
                    className="rounded-2xl p-4 border border-gray-100 bg-white shadow-sm text-center hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}
                    >
                      {icon}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 leading-none">
                      {value}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 px-5 py-3.5 bg-linear-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100/60">
                <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="text-xs font-semibold text-indigo-700 shrink-0">
                  View → Apply
                </span>
                <div className="flex-1 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(Number(conversionRate), 100)}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-indigo-700 shrink-0">
                  {conversionRate}%
                </span>
              </div>

              {job.description && (
                <div>
                  <SectionTitle icon={<Briefcase className="w-3.5 h-3.5" />}>
                    About the Role
                  </SectionTitle>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line pl-8">
                    {job.description}
                  </p>
                </div>
              )}

              {job.responsibilities?.length > 0 && (
                <div>
                  <SectionTitle icon={<ListChecks className="w-3.5 h-3.5" />}>
                    Responsibilities
                  </SectionTitle>
                  <ul className="space-y-2 pl-8">
                    {job.responsibilities.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-gray-600"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.requirements?.length > 0 && (
                <div>
                  <SectionTitle icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                    Requirements
                  </SectionTitle>
                  <ul className="space-y-2 pl-8">
                    {job.requirements.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-gray-600"
                      >
                        <span className="text-amber-400 shrink-0 mt-0.5">
                          ◆
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <SectionTitle icon={<Layers className="w-3.5 h-3.5" />}>
                    Required Skills
                  </SectionTitle>
                  <div className="flex flex-wrap gap-2 pl-8">
                    {job.requiredSkills?.length > 0 ? (
                      job.requiredSkills.map((s, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-100"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 pl-0">
                        None listed
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <SectionTitle icon={<Star className="w-3.5 h-3.5" />}>
                    Preferred Skills
                  </SectionTitle>
                  <div className="flex flex-wrap gap-2 pl-8">
                    {job.preferredSkills?.length > 0 ? (
                      job.preferredSkills.map((s, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-semibold rounded-xl border border-violet-100"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">None listed</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <SectionTitle icon={<Building2 className="w-3.5 h-3.5" />}>
                  Job Details
                </SectionTitle>
                <div className="grid grid-cols-2 gap-2.5 pl-8">
                  {[
                    {
                      icon: <Building2 className="w-3.5 h-3.5" />,
                      label: "Department",
                      value: job.department,
                    },
                    {
                      icon: <GraduationCap className="w-3.5 h-3.5" />,
                      label: "Experience",
                      value: `${job.experienceMin}–${job.experienceMax} yrs`,
                    },
                    {
                      icon: <CalendarDays className="w-3.5 h-3.5" />,
                      label: "Posted On",
                      value: job.postedDate,
                    },
                    {
                      icon: <CalendarDays className="w-3.5 h-3.5" />,
                      label: "Expires",
                      value: job.expiresDate,
                    },
                    {
                      icon: <Users className="w-3.5 h-3.5" />,
                      label: "Positions",
                      value: `${job.positions} open`,
                    },
                    {
                      icon: <Briefcase className="w-3.5 h-3.5" />,
                      label: "Job Type",
                      value: job.jobType,
                    },
                  ].map(({ icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:border-gray-200 transition-all"
                    >
                      <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow-sm shrink-0">
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          {label}
                        </p>
                        <p className="text-sm font-bold text-gray-800 truncate capitalize mt-0.5">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "applicants" && (
            <div className="p-7">
              {job.applicants && job.applicants.length > 0 ? (
                <div className="space-y-3">
                  {job.applicants.map((applicant) => {
                    const appStatus =
                      applicantStatusConfig[applicant.status] ??
                      applicantStatusConfig.pending;
                    return (
                      <div
                        key={applicant.id}
                        className="group p-5 bg-white rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={applicant.avatar}
                            alt={applicant.name}
                            className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-md shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${appStatus.bg} ${appStatus.text}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${appStatus.dot}`}
                                />
                                {appStatus.label}
                              </span>
                            </div>

                            <div className="flex items-center flex-wrap gap-4 mt-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" />
                                {applicant.email}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5" />
                                {applicant.phone}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-gray-900 leading-none">
                                      {applicant.aiScore}%
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                      AI Match
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                  Applied {applicant.appliedDate}
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <Users className="w-9 h-9 text-gray-300" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    No applicants yet
                  </h3>
                  <p className="text-sm text-gray-400 mt-1.5 max-w-xs">
                    Applications will show up here once candidates start
                    applying
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 bg-gray-50/60 shrink-0">
          {deleteState !== "idle" && (
            <div
              className={`px-6 py-3.5 border-b flex items-center gap-3 transition-all ${
                deleteState === "error"
                  ? "bg-red-50 border-red-100"
                  : "bg-rose-50 border-rose-100"
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                {deleteState === "deleting" ? (
                  <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                ) : deleteState === "error" ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800">
                  {deleteState === "deleting"
                    ? `Deleting "${job.title}"...`
                    : deleteState === "error"
                      ? (deleteError ?? "Something went wrong")
                      : `Delete "${job.title}"?`}
                </p>
                {deleteState === "confirm" && (
                  <p className="text-xs text-red-500 mt-0.5">
                    This action cannot be undone.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {(deleteState === "confirm" || deleteState === "error") && (
                  <button
                    onClick={handleDeleteCancel}
                    className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteState === "deleting" || loading}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all min-w-22.5 ${
                    deleteState === "deleting" || loading
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                  }`}
                >
                  {deleteState === "deleting" || loading
                    ? "Deleting..."
                    : deleteState === "error"
                      ? "Retry"
                      : "Yes, Delete"}
                </button>
              </div>
            </div>
          )}

          <div className="p-5 flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-200/60 transition-all duration-200"
            >
              <Edit3 className="w-4 h-4" />
              Edit Job Post
            </button>

            <button
              onClick={() => {
                onClose();
                navigate(`/recruiter/jobs/${job.id}/applications`);
              }}
              className="relative flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-200/60 transition-all duration-200"
            >
              <Users className="w-4 h-4" />
              View Applications
              {job.applications > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs font-extrabold">
                  {job.applications}
                </span>
              )}
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={deleteState === "deleting" || loading}
              title="Delete job"
              className="w-12 h-12 flex items-center justify-center border-2 border-red-100 text-red-400 rounded-2xl hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all disabled:opacity-40"
            >
              {deleteState === "deleting" || loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); opacity: 0.5; }
          to   { transform: translateX(0);    opacity: 1;   }
        }
      `}</style>
    </>
  );
}
