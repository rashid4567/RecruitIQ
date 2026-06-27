import {
  FileText,
  Download,
  Loader2,
  Info,
  X,
  Eye,
  ExternalLink,
  ZoomIn,
  Calendar,
  Clock,
  Activity,
} from "lucide-react";
import { ApplicationAnalysisStatus } from "@/module/job-application/types/jobApplication.types";
import { type DS, SM } from "./Index";
import { fmt } from "./Indexs";
import { useResumeActions } from "@/module/resume/hook/Useresumeactions";

function ResumePreviewModal({
  url,
  iframeReady,
  onReady,
  onClose,
  onDownload,
  downloading,
}: {
  url: string;
  iframeReady: boolean;
  onReady: () => void;
  onClose: () => void;
  onDownload: () => void;
  downloading: boolean;
}) {
  const viewerUrl = url.toLowerCase().match(/\.(docx?|doc)(\?|$)/)
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    : url;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <span className="text-sm font-bold text-slate-900">
              Resume Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in tab
            </a>
            <button
              onClick={onDownload}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors disabled:opacity-60"
            >
              {downloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Download
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* iframe */}
        <div className="relative flex-1 bg-slate-100">
          {!iframeReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
              </div>
              <p className="text-sm text-slate-400 font-medium">
                Loading resume…
              </p>
            </div>
          )}
          <iframe
            src={viewerUrl}
            title="Resume Preview"
            className={`w-full h-full border-0 transition-opacity duration-300 ${
              iframeReady ? "opacity-100" : "opacity-0"
            }`}
            onLoad={onReady}
          />
        </div>
      </div>
    </div>
  );
}

export function ResumeCard({ resumeId }: { resumeId: string | undefined }) {
  const {
    previewUrl,
    loadingPreview,
    loadingDownload,
    iframeReady,
    setIframeReady,
    error,
    openPreview,
    closePreview,
    download,
  } = useResumeActions(resumeId ?? "");

  if (!resumeId) return null;

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Resume</h3>
        </div>

        <div className="p-5 space-y-3">
          {/* Clickable preview tile */}
          <button
            onClick={openPreview}
            disabled={loadingPreview}
            className="w-full relative group h-24 rounded-xl bg-linear-to-br from-slate-50 to-slate-100 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 overflow-hidden hover:border-indigo-300 hover:from-indigo-50 hover:to-indigo-50/50 transition-all disabled:cursor-not-allowed"
          >
            <div className="absolute inset-x-6 top-4 space-y-1.5 opacity-20 pointer-events-none">
              {[80, 60, 70, 50].map((w, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full bg-slate-400 group-hover:bg-indigo-400 transition-colors"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
            {loadingPreview ? (
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin relative z-10" />
            ) : (
              <>
                <ZoomIn className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors relative z-10" />
                <span className="text-[11px] text-slate-400 group-hover:text-indigo-500 font-medium transition-colors relative z-10">
                  Click to preview
                </span>
              </>
            )}
          </button>

          {error && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={openPreview}
              disabled={loadingPreview}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 rounded-xl border border-indigo-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingPreview ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
              Preview
            </button>
            <button
              onClick={download}
              disabled={loadingDownload}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 rounded-xl border border-slate-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingDownload ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Download
            </button>
          </div>
        </div>
      </div>

      {previewUrl && (
        <ResumePreviewModal
          url={previewUrl}
          iframeReady={iframeReady}
          onReady={() => setIframeReady(true)}
          onClose={closePreview}
          onDownload={download}
          downloading={loadingDownload}
        />
      )}
    </>
  );
}

const ANALYSIS_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  [ApplicationAnalysisStatus.PENDING]: {
    label: "Pending",
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  [ApplicationAnalysisStatus.PROCESSING]: {
    label: "Processing…",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },
  [ApplicationAnalysisStatus.COMPLETED]: {
    label: "Completed",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  [ApplicationAnalysisStatus.FAILED]: {
    label: "Failed",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
};

function AnalysisStatusBadge({ status }: { status: string }) {
  const cfg =
    ANALYSIS_STATUS_CONFIG[status] ??
    ANALYSIS_STATUS_CONFIG[ApplicationAnalysisStatus.PENDING];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${
          status === ApplicationAnalysisStatus.PROCESSING ? "animate-pulse" : ""
        }`}
      />
      {cfg.label}
    </span>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
  divider,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  divider?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 ${
        divider ? "pt-3 border-t border-slate-100" : ""
      }`}
    >
      <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium shrink-0">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span className="text-xs font-semibold text-slate-700 text-right">
        {children}
      </span>
    </div>
  );
}

export function ApplicationInfoCard({
  appliedAt,
  updatedAt,
  analysisStatus,
  ds,
}: {
  appliedAt: string | undefined;
  updatedAt: string | undefined;
  analysisStatus: string | undefined;
  ds: DS;
}) {
  const sm = SM[ds];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
          <Info className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Application Info</h3>
      </div>

      <div className="px-5 py-4 space-y-3">
        <InfoRow icon={Calendar} label="Applied on">
          {fmt(appliedAt)}
        </InfoRow>
        <InfoRow icon={Clock} label="Last updated">
          {fmt(updatedAt)}
        </InfoRow>
        <InfoRow icon={Activity} label="Status">
          <span className={`font-bold ${sm.color}`}>{ds}</span>
        </InfoRow>
        {analysisStatus && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Activity className="w-3.5 h-3.5" />
              AI Analysis
            </span>
            <AnalysisStatusBadge status={analysisStatus} />
          </div>
        )}
      </div>
    </div>
  );
}
