import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Edit3, ExternalLink, Trash2, MapPin, Clock, DollarSign,
  Building2, CalendarDays, Star, Mail, Phone, CheckCircle2,
  XCircle, Users, Eye, Briefcase, Layers,
  GraduationCap, Globe, ListChecks, Sparkles, AlertTriangle, Loader2,
} from "lucide-react";
import type { JobCardProps } from "../../../types/jobCard.types";
import { useDeleteJobPost } from "../../../hooks/jobPost/useDeleteJopPost"; 

const statusConfig = {
  Active:  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", badge: "border-emerald-200" },
  Paused:  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   badge: "border-amber-200"  },
  Expired: { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500",     badge: "border-red-200"    },
  Draft:   { bg: "bg-gray-50",    text: "text-gray-600",    dot: "bg-gray-400",    badge: "border-gray-200"   },
};

const applicantStatusConfig = {
  pending:     { bg: "bg-gray-100",    text: "text-gray-700",    label: "Pending"     },
  shortlisted: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Shortlisted" },
  rejected:    { bg: "bg-red-100",     text: "text-red-700",     label: "Rejected"    },
  interviewed: { bg: "bg-blue-100",    text: "text-blue-700",    label: "Interviewed" },
};

type DeleteState = "idle" | "confirm" | "deleting" | "error";

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

  const status = statusConfig[job.status];
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
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <div className="flex items-start justify-between mt-1">
            <div className="flex-1 pr-4">
              <div className="flex items-center flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                  {job.category}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 border ${status.bg} ${status.text} ${status.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {job.status}
                </span>
                {job.isRemote && (
                  <span className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-lg border border-violet-100 flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Remote
                  </span>
                )}
                {job.positions > 1 && (
                  <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-lg border border-orange-100 flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> {job.positions} Openings
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{job.title}</h2>

              <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5">
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />{job.location}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5 text-sm text-gray-500 capitalize">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />{job.jobType}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <DollarSign className="w-3.5 h-3.5 text-gray-400" />{job.salary}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  {job.experienceMin}–{job.experienceMax} yrs exp
                </span>
              </div>
            </div>

            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors mt-1 shrink-0">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6 bg-gray-50/60">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "overview" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={`px-5 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "applicants" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Applicants
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">
              {job.applicants?.length ?? job.applications}
            </span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "overview" ? (
            <div className="p-6 space-y-7">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: Eye,      value: job.views,            label: "Views" },
                  { icon: Users,    value: job.applications,     label: "Applied" },
                  { icon: Star,     value: job.shortlisted,      label: "Shortlisted" },
                  { icon: Sparkles, value: `${job.avgAiScore}%`, label: "AI Score" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="rounded-2xl p-4 text-center border bg-gray-50 border-gray-100">
                    <Icon className="w-4 h-4 mx-auto mb-1.5 text-gray-400" />
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Conversion Rate */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-500 shrink-0">View → Apply rate</span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    style={{ width: `${Math.min(Number(conversionRate), 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-blue-600 shrink-0">{conversionRate}%</span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" /> Job Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {job.description || "No description provided."}
                </p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-gray-400" /> Responsibilities
                  </h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gray-400" /> Requirements
                  </h3>
                  <ul className="space-y-2">
                    {job.requirements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gray-400" /> Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills?.length > 0 ? (
                      job.requiredSkills.map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-xl border border-blue-100">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">None listed</span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-400" /> Preferred Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.preferredSkills?.length > 0 ? (
                      job.preferredSkills.map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-medium rounded-xl border border-violet-100">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">None listed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Building2, label: "Department", value: job.department },
                  { icon: GraduationCap, label: "Experience", value: `${job.experienceMin}–${job.experienceMax} years` },
                  { icon: CalendarDays, label: "Posted On", value: job.postedDate },
                  { icon: CalendarDays, label: "Expires", value: job.expiresDate },
                  { icon: Users, label: "Positions", value: `${job.positions} open` },
                  { icon: Briefcase, label: "Job Type", value: job.jobType },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                      <Icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-semibold text-gray-900 truncate capitalize">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Applicants Tab */
            <div className="p-6 space-y-3">
              {job.applicants && job.applicants.length > 0 ? (
                job.applicants.map((applicant) => {
                  const appStatus = applicantStatusConfig[applicant.status];
                  return (
                    <div key={applicant.id} className="p-5 bg-gray-50 hover:bg-blue-50/30 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all group">
                      <div className="flex items-start gap-4">
                        <img src={applicant.avatar} alt={applicant.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">{applicant.name}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">{applicant.experience}</p>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${appStatus.bg} ${appStatus.text}`}>
                              {appStatus.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mt-2.5 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{applicant.email}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{applicant.phone}</span>
                          </div>

                          <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                  <Star className="w-3.5 h-3.5 text-amber-500" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-gray-900 leading-none">{applicant.aiScore}%</p>
                                  <p className="text-xs text-gray-400 mt-0.5">AI Score</p>
                                </div>
                              </div>
                              <span className="text-xs text-gray-400">Applied {applicant.appliedDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-24">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">No applicants yet</h3>
                  <p className="text-sm text-gray-400 mt-1">Applications will appear here once candidates apply</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/80">

          {/* Delete Banner */}
          {deleteState !== "idle" && (
            <div className="px-5 py-3 bg-red-50 border-b border-red-100 flex items-center gap-3">
              {deleteState === "error" ? (
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              ) : deleteState === "deleting" ? (
                <Loader2 className="w-5 h-5 text-red-500 animate-spin shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              )}

              <p className="text-sm text-red-700 flex-1">
                {deleteState === "deleting" ? (
                  <>Deleting <span className="font-semibold">"{job.title}"</span>...</>
                ) : deleteState === "error" ? (
                  deleteError || "Failed to delete job. Please try again."
                ) : (
                  <>
                    Delete <span className="font-semibold">"{job.title}"</span>?
                    <span className="block text-red-600 text-xs mt-0.5">This action cannot be undone.</span>
                  </>
                )}
              </p>

              <div className="flex items-center gap-2">
                {(deleteState === "confirm" || deleteState === "error") && (
                  <button
                    onClick={handleDeleteCancel}
                    className="px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}

                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteState === "deleting" || loading}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors min-w-[100px] ${
                    deleteState === "deleting" || loading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {deleteState === "deleting" || loading ? "Deleting..." : deleteState === "error" ? "Retry" : "Yes, Delete"}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-5 flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Edit Job
            </button>

            {job.externalLink && (
              <a
                href={job.externalLink}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 border border-gray-200 rounded-xl hover:bg-white hover:border-gray-300 transition-all"
              >
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </a>
            )}

            <button
              onClick={handleDeleteClick}
              disabled={deleteState === "deleting" || loading}
              className="px-5 py-3 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50"
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
    </>
  );
}