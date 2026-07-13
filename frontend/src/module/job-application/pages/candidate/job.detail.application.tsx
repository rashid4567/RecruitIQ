import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, TrendingUp, FileText, Check } from "lucide-react";

import { useApplicationDetail } from "../../hooks/candidate/useApplicationDetail";
import { useDownloadResume } from "@/module/resume/hook/useDownloadResume";
import { ApplicationStatus } from "../../types/jobApplication.types";
import Sidebar from "../../../candidate/pages/components/personalInfo/shared/candidateSidebar";
import { ApplicationHeader } from "../component/candidate-details/Applicationheader";
import { LeftPanel } from "../component/candidate-details/Leftpanel";
import { OfferLetterSection } from "../component/candidate-details/OfferLetterSection";
import {
  Timeline,
  type TimelineStep,
} from "../component/candidate-details/Timeline";
import { InterviewCard } from "../component/candidate-details/Interviewcard";
import { SkillsSection } from "../component/candidate-details/Skillssection";
import { SectionCard } from "../component/candidate-details/Sectioncard";
import { WithdrawModal } from "../component/candidate-details/Withdrawmodal";
import { InterviewTipsSection } from "../component/candidate-details/Interviewtipssection";
import {
  statusToStep,
  getStatusConfig,
} from "../component/candidate-details/Statusconfig";
import { formatDate } from "../component/candidate-details/Formatters";

export default function JobApplicationDetail() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { loading, error, applicationDetail, fetchApplicationDetail } =
    useApplicationDetail();
  const { downloadResume, loading: downloadLoading } = useDownloadResume();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [expandedCover, setExpandedCover] = useState(false);

  useEffect(() => {
    if (applicationId) fetchApplicationDetail(applicationId);
  }, [applicationId, fetchApplicationDetail]);

  const handleWithdrawConfirm = useCallback(async () => {
    setWithdrawLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setShowWithdrawModal(false);
      navigate(-1);
    } finally {
      setWithdrawLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading your application…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !applicationDetail) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-slate-700 font-medium">
                {error ?? "We couldn't find this application"}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Try again, or go back to your applications.
              </p>
            </div>
            <button
              onClick={() =>
                applicationId && fetchApplicationDetail(applicationId)
              }
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { application, job, offer } = applicationDetail;
  const appStatus = application.status;
  const currentStep = statusToStep(appStatus);
  const statusCfg = getStatusConfig(appStatus);
  const interview = application.interview;

  const requiredSkills: string[] = job.requiredSkills ?? [];
  const preferredSkills: string[] = job.preferredSkills ?? [];
  const allSkills = [...new Set([...requiredSkills, ...preferredSkills])];

  const timelineSteps: TimelineStep[] = [
    {
      stepIndex: 0,
      title: "Application submitted",
      description: "Your application was successfully received.",
      date: formatDate(application.appliedAt),
    },
  ];

  if (
    appStatus === ApplicationStatus.SHORTLISTED ||
    appStatus === ApplicationStatus.INTERVIEW_SCHEDULED ||
    appStatus === ApplicationStatus.SELECTED
  ) {
    timelineSteps.push({
      stepIndex: 1,
      title: "Application shortlisted",
      description: "Your profile has been shortlisted by the recruiter.",
      date: formatDate(application.updatedAt),
    });
  }

  if (
    appStatus === ApplicationStatus.INTERVIEW_SCHEDULED ||
    appStatus === ApplicationStatus.SELECTED
  ) {
    timelineSteps.push({
      stepIndex: 2,
      title: "Interview scheduled",
      description: interview
        ? `Scheduled for ${formatDate(interview.scheduledAt)}`
        : "Interview has been scheduled.",
      date: interview ? formatDate(interview.scheduledAt) : undefined,
    });
  }

  if (appStatus === ApplicationStatus.SELECTED) {
    timelineSteps.push({
      stepIndex: 3,
      title: "Selected",
      description: "Congratulations! You have been selected.",
    });
  }

  if (appStatus === ApplicationStatus.REJECTED) {
    timelineSteps.push({
      stepIndex: timelineSteps.length,
      title: "Rejected",
      description: application.rejectionReason
        ? `Application rejected. ${application.rejectionReason}`
        : "Application rejected.",
    });
  }

  if (appStatus === ApplicationStatus.WITHDRAWN) {
    timelineSteps.push({
      stepIndex: timelineSteps.length,
      title: "Withdrawn",
      description: "You withdrew this application.",
    });
  }

  const getStep = (si: number): "done" | "active" | "pending" => {
    if (si < currentStep) return "done";
    if (si === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ApplicationHeader jobTitle={job.title} companyName={job.department} />

        <div className="flex-1 overflow-hidden flex">
          <div className="w-80 shrink-0 overflow-y-auto border-r border-slate-100 p-5 hidden lg:block bg-white/50">
            <LeftPanel
              job={job}
              application={application}
              statusCfg={statusCfg}
              currentStep={currentStep}
              onWithdraw={() => setShowWithdrawModal(true)}
              downloadResume={downloadResume}
              downloadLoading={downloadLoading}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-6 py-6 space-y-5">
              <div className="lg:hidden">
                <LeftPanel
                  job={job}
                  application={application}
                  statusCfg={statusCfg}
                  currentStep={currentStep}
                  onWithdraw={() => setShowWithdrawModal(true)}
                  downloadResume={downloadResume}
                  downloadLoading={downloadLoading}
                />
              </div>

              {/* Offer takes priority over the interview card once it exists */}
              {offer && <OfferLetterSection offer={offer} />}

              {interview && <InterviewCard interview={interview} />}

              <SectionCard
                title="Application timeline"
                icon={<TrendingUp className="w-4 h-4" />}
              >
                <Timeline timelineSteps={timelineSteps} getStep={getStep} />
              </SectionCard>

              {application.status === ApplicationStatus.REJECTED &&
                application.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                    <h2 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Rejection feedback
                    </h2>
                    <p className="text-sm text-red-600 leading-relaxed">
                      {application.rejectionReason}
                    </p>
                  </div>
                )}

              <SkillsSection
                requiredSkills={requiredSkills}
                preferredSkills={preferredSkills}
              />

              {job.description && (
                <SectionCard
                  title="Job description"
                  icon={<FileText className="w-4 h-4" />}
                  collapsible
                >
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line pt-4">
                    {job.description}
                  </p>
                </SectionCard>
              )}

              {(job.responsibilities?.length > 0 ||
                job.requirements?.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.responsibilities?.length > 0 && (
                    <SectionCard title="Responsibilities">
                      <ul className="space-y-2.5 pt-4">
                        {job.responsibilities.map((r: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-slate-600"
                          >
                            <span className="text-blue-400 font-bold mt-0.5 shrink-0 text-base leading-none">
                              →
                            </span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </SectionCard>
                  )}
                  {job.requirements?.length > 0 && (
                    <SectionCard title="Requirements">
                      <ul className="space-y-2.5 pt-4">
                        {job.requirements.map((r: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-slate-600"
                          >
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </SectionCard>
                  )}
                </div>
              )}

              {application.coverLetter && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedCover((p) => !p)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      Cover letter
                    </h2>
                    <span className="text-xs text-slate-400">
                      {expandedCover ? "Collapse" : "Expand"}
                    </span>
                  </button>
                  {expandedCover && (
                    <div className="border-t border-slate-50 px-6 pb-6 pt-4">
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <InterviewTipsSection allSkills={allSkills} />

              <div className="pb-8" />
            </div>
          </div>
        </div>
      </div>

      {showWithdrawModal && (
        <WithdrawModal
          jobTitle={job.title}
          onConfirm={handleWithdrawConfirm}
          onCancel={() => setShowWithdrawModal(false)}
          loading={withdrawLoading}
        />
      )}
    </div>
  );
}
