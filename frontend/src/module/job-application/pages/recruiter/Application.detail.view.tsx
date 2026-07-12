import React, { useState, useEffect, useCallback } from "react";
import {
  Star,
  Target,
  Award,
  BookOpen,
  Sparkles,
  BarChart2,
  FileText,
  XCircle,
  Zap,
  Info,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecruiterApplicationDetails } from "../../hooks/recruiter/useRecruiterApplicationDetails";
import { useUpdateApplicationStatus } from "../../hooks/recruiter/useUpdateApplicationStatus";
import {
  ApplicationStatus,
  ApplicationAnalysisStatus,
  type ApplicationAIAnalysis,
  type InterviewInfo,
} from "../../types/jobApplication.types";
import type { RecruiterInterviewItem } from "@/module/interview/types/recruiterInterview.types";
import type { InterviewStatus } from "@/module/interview/types/interview.types";
import Sidebar from "@/module/recruiter/pages/components/layout/Sidebar";
import Header from "@/pages/landing/sections/Header";
import {
  Empty,
  ScoreTile,
  Section,
} from "../component/recruiter-application.detail/Primitives";
import { ScoreBar } from "@/components/admin/scoreBar";
import {
  GapsColumn,
  MissingSkillsColumn,
  RecBanner,
  StrengthsColumn,
} from "../component/recruiter-application.detail/Aianalysis";
import {
  ACTION_TO_STATUS,
  RM,
  type ModalAction,
} from "../component/recruiter-application.detail/Index";
import { mapStatus } from "../component/recruiter-application.detail/Indexs";
import { CandidateHero } from "../component/recruiter-application.detail/Candidatehero";
import { RecruiterActionsPanel } from "../component/recruiter-application.detail/Recruiteractions";
import { InterviewCard } from "../component/candidate-details/Interviewcard";
import {
  ApplicationInfoCard,
  ResumeCard,
} from "../component/recruiter-application.detail/Sidebarcards";
import { ConfirmModal } from "../component/recruiter-application.detail/Confirmmodal";
import { MODAL_CONFIGS } from "../component/recruiter-application.detail/Modalconfigs";
import ScheduleInterviewModal from "@/module/interview/pages/components/schedule-interview-modal";
import { OfferLetterCard } from "../component/recruiter-application.detail/OfferLetterCard";

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <Sidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

function CenteredShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <CenteredShell>
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          Loading application…
        </p>
      </div>
    </CenteredShell>
  );
}

function ErrorScreen({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <CenteredShell>
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center space-y-5">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 text-base">
            Failed to load application
          </p>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    </CenteredShell>
  );
}

function AnalysisPending({ status }: { status: string | undefined }) {
  if (status === ApplicationAnalysisStatus.PROCESSING) {
    return (
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-indigo-50 border border-indigo-100">
        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0" />
        <p className="text-sm text-indigo-700 font-medium">
          AI analysis in progress — check back shortly.
        </p>
      </div>
    );
  }

  if (status === ApplicationAnalysisStatus.QUOTA_EXCEEDED) {
    return (
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-amber-50 border border-amber-100">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-700">
            AI analysis unavailable
          </p>
          <p className="text-xs text-amber-600">
            Your AI score limit has been reached. Upgrade your subscription to
            unlock this analysis.
          </p>
        </div>
      </div>
    );
  }

  if (status === ApplicationAnalysisStatus.FAILED) {
    return (
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-100">
        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
        <p className="text-sm text-red-700">
          Analysis failed. Please try again later.
        </p>
      </div>
    );
  }

  return <Empty text="AI analysis hasn't been run for this application yet." />;
}

function AIScores({ ai }: { ai: ApplicationAIAnalysis }) {
  return (
    <Section
      title="Evaluation Scores"
      subtitle="Across all assessment dimensions"
      Icon={Sparkles}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <ScoreTile
          label="Overall"
          value={ai.overallScore}
          color="#6366f1"
          Icon={Star}
        />
        <ScoreTile
          label="Skills"
          value={ai.requiredSkillsScore}
          color="#10b981"
          Icon={Target}
        />
        <ScoreTile
          label="Experience"
          value={ai.experienceScore}
          color="#f59e0b"
          Icon={Award}
        />
        <ScoreTile
          label="Education"
          value={ai.educationScore}
          color="#8b5cf6"
          Icon={BookOpen}
        />
      </div>

      <div className="space-y-3 pt-5 border-t border-slate-100">
        <ScoreBar
          label="Required Skills"
          value={ai.requiredSkillsScore}
          fill="bg-indigo-500"
        />
        <ScoreBar
          label="Preferred Skills"
          value={ai.preferredSkillsScore}
          fill="bg-emerald-500"
        />
        <ScoreBar
          label="Experience"
          value={ai.experienceScore}
          fill="bg-amber-400"
        />
        <ScoreBar
          label="Requirements"
          value={ai.requirementsScore}
          fill="bg-violet-500"
        />
        <ScoreBar
          label="Education"
          value={ai.educationScore}
          fill="bg-pink-500"
        />
      </div>
    </Section>
  );
}

function AIFeedback({ ai }: { ai: ApplicationAIAnalysis }) {
  return (
    <Section
      title="Detailed Feedback"
      subtitle="Strengths, gaps, and missing critical skills"
      Icon={BarChart2}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StrengthsColumn items={ai.strengths} />
        <GapsColumn items={ai.gaps} />
        <MissingSkillsColumn items={ai.missingCriticalSkills} />
      </div>
    </Section>
  );
}

function AIAnalysisSection({
  ai,
  analysisStatus,
}: {
  ai: ApplicationAIAnalysis | undefined;
  analysisStatus: string | undefined;
}) {
  const isComplete =
    analysisStatus === ApplicationAnalysisStatus.COMPLETED && ai;

  if (!isComplete) {
    return (
      <Section title="AI Analysis" Icon={Info}>
        <AnalysisPending status={analysisStatus} />
      </Section>
    );
  }

  const rec = RM[ai.recommendation];

  return (
    <>
      {rec && (
        <RecBanner
          rec={rec}
          analyzedAt={ai.analyzedAt}
          overallScore={ai.overallScore}
        />
      )}
      <AIScores ai={ai} />
      {ai.summary && (
        <Section
          title="AI Summary"
          subtitle="Generated candidate evaluation"
          Icon={Zap}
        >
          <p className="text-sm text-slate-700 leading-relaxed">{ai.summary}</p>
        </Section>
      )}
      <AIFeedback ai={ai} />
    </>
  );
}

function CoverLetterSection({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 600;
  const display = isLong && !expanded ? text.slice(0, 600) + "…" : text;

  return (
    <Section
      title="Cover Letter"
      subtitle="Submitted by the candidate"
      Icon={FileText}
    >
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
        {display}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </button>
      )}
    </Section>
  );
}

function RejectionReasonSection({ reason }: { reason: string }) {
  return (
    <Section title="Rejection Reason" Icon={XCircle}>
      <div className="flex gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-100">
        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
        <p className="text-sm text-red-700 leading-relaxed">{reason}</p>
      </div>
    </Section>
  );
}

export default function CandidateScorecardPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalAction>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const { loading, error, application, fetchApplicationDetails } =
    useRecruiterApplicationDetails();
  const { loading: statusLoading, updateStatus } = useUpdateApplicationStatus();

  useEffect(() => {
    if (applicationId) fetchApplicationDetails(applicationId);
  }, [applicationId, fetchApplicationDetails]);

  const handleConfirm = useCallback(
    async (reason?: string) => {
      if (!modal || !application?.applicationId) return;
      if (modal === "interview") {
        setModal(null);
        setScheduleModalOpen(true);
        return;
      }

      const ok = await updateStatus({
        applicationId: application.applicationId,
        status: ACTION_TO_STATUS[modal],
        rejectionReason: reason,
      });
      if (ok && applicationId) {
        await fetchApplicationDetails(applicationId);
        setModal(null);
      }
    },
    [modal, application, applicationId, updateStatus, fetchApplicationDetails],
  );
  const handleAction = (action: ModalAction) => {
    if (!application) return;
    setModal(action);
  };

  // Navigates to the hiring-decision screen for a given interview. The
  // RecruiterActionsPanel never mutates status directly for "Selected" —
  // it only routes here; the actual transition to SELECTED happens inside
  // CreateOfferUseCase once the recruiter completes that flow.
  // NOTE: confirm this route matches your actual router config.
  const handleNavigateToHiringDecision = useCallback(
    (interviewId: string) => {
      navigate(`/recruiter/interviews/${interviewId}/hiring-decision`);
    },
    [navigate],
  );

  async function handleScheduleSuccess() {
    setScheduleModalOpen(false);
    if (applicationId) await fetchApplicationDetails(applicationId);
  }

  const handleCreateOffer = () => {
    console.log("Create offer for application:", applicationId);
  };

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <ErrorScreen
        error={error}
        onRetry={() => applicationId && fetchApplicationDetails(applicationId)}
      />
    );
  }

  if (!application) {
    return (
      <CenteredShell>
        <Empty text="No application data found." />
      </CenteredShell>
    );
  }

  const ds = mapStatus(application.status);
  const ai: ApplicationAIAnalysis | undefined = application.aiAnalysis;
  const interview: InterviewInfo | undefined = application.interview;
  const isRejected = application.status === ApplicationStatus.REJECTED;
  const isWithdrawn = application.status === ApplicationStatus.WITHDRAWN;
  const isClosed = isRejected || isWithdrawn;

  const scheduleContext = {
    applicationId: application.applicationId,
    candidateName: application.candidateName,
    candidateEmail: application.candidateEmail,
    applicationStatus: application.status,
  } as unknown as RecruiterInterviewItem;

  return (
    <PageShell>
      <Header />

      <CandidateHero
        candidateName={application.candidateName}
        candidateEmail={application.candidateEmail}
        appliedAt={application.appliedAt}
        ds={ds}
        isRejected={isRejected}
        isWithdrawn={isWithdrawn}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-7">
        <div className="lg:col-span-2 space-y-6">
          <AIAnalysisSection
            ai={ai}
            analysisStatus={application.analysisStatus}
          />

          {application.coverLetter && (
            <CoverLetterSection text={application.coverLetter} />
          )}

          {isRejected && application.rejectionReason && (
            <RejectionReasonSection reason={application.rejectionReason} />
          )}
        </div>

        <div className="space-y-5">
          <RecruiterActionsPanel
            status={application.status}
            statusLoading={statusLoading}
            isClosed={isClosed}
            isRejected={isRejected}
            isWithdrawn={isWithdrawn}
            interviewId={interview?.id}
            interviewStatus={interview?.status as InterviewStatus | undefined}
            onAction={handleAction}
            onNavigateToHiringDecision={handleNavigateToHiringDecision}
          />
          {interview && <InterviewCard interview={interview} />}
          <OfferLetterCard
            offer={application.offer}
            onCreateOffer={handleCreateOffer}
          />
          <ResumeCard resumeId={application.resumeId} />
          <ApplicationInfoCard
            applicationNumber={application.applicationNumber}
            appliedAt={application.appliedAt}
            updatedAt={application.updatedAt}
            analysisStatus={application.analysisStatus}
            ds={ds}
          />
        </div>
      </div>

      {modal && (
        <ConfirmModal
          config={MODAL_CONFIGS[modal]}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
          loading={statusLoading}
        />
      )}

      <ScheduleInterviewModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        applicationId={application.applicationId}
        interview={scheduleContext}
        onSuccess={handleScheduleSuccess}
      />
    </PageShell>
  );
}