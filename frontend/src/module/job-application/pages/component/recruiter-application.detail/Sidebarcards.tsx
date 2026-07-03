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
  Hash,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-4xl h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl bg-indigo-50 flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <span className="text-base font-semibold text-slate-900">Resume Preview</span>
              <p className="text-xs text-slate-400 -mt-0.5">PDF / DOCX viewer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all active:scale-[0.985]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in new tab
            </a>
            <button
              onClick={onDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 rounded-2xl border border-indigo-100 transition-all active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed"
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
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="relative flex-1 bg-slate-50 overflow-hidden">
          {!iframeReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-white/70">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500">Loading resume document...</p>
                <p className="text-xs text-slate-400 mt-1">This may take a few seconds</p>
              </div>
            </div>
          )}

          <iframe
            src={viewerUrl}
            title="Resume Preview"
            className={`w-full h-full border-0 transition-opacity duration-500 ${iframeReady ? "opacity-100" : "opacity-0"}`}
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
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <div className="w-8 h-8 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-slate-900">Resume</h3>
        </div>

        <div className="p-6 space-y-4">
          {/* Preview Tile */}
          <button
            onClick={openPreview}
            disabled={loadingPreview}
            className="w-full group relative h-28 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-dashed border-slate-200 hover:border-indigo-300 hover:shadow-inner transition-all duration-200 overflow-hidden disabled:cursor-not-allowed active:scale-[0.985]"
          >
            <div className="absolute inset-x-8 top-5 space-y-2 opacity-30 pointer-events-none group-hover:opacity-40 transition-opacity">
              {[85, 65, 78, 55].map((w, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-300 transition-colors"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-1.5">
              {loadingPreview ? (
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
              ) : (
                <>
                  <ZoomIn className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-xs font-medium text-slate-400 group-hover:text-indigo-600 transition-colors">
                    Click to preview resume
                  </span>
                </>
              )}
            </div>
          </button>

          {error && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 bg-red-50 px-3 py-2 rounded-2xl border border-red-100">
              <Info className="w-3.5 h-3.5" />
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={openPreview}
              disabled={loadingPreview}
              className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 rounded-2xl border border-indigo-100 transition-all active:scale-[0.985] disabled:opacity-60"
            >
              {loadingPreview ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              Preview
            </button>

            <button
              onClick={download}
              disabled={loadingDownload}
              className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-2xl border border-slate-200 transition-all active:scale-[0.985] disabled:opacity-60"
            >
              {loadingDownload ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
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
    label: "Processing",
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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl text-xs font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${cfg.dot} ${
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
      className={`flex items-center justify-between gap-4 py-3 ${
        divider ? "border-t border-slate-100" : ""
      }`}
    >
      <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Icon className="w-4 h-4 text-slate-400" />
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-800 text-right max-w-[180px] truncate">
        {children}
      </span>
    </div>
  );
}

export function ApplicationInfoCard({
  appliedAt,
  updatedAt,
  analysisStatus,
  applicationNumber,
  ds,
}: {
  appliedAt: string | undefined;
  updatedAt: string | undefined;
  analysisStatus: string | undefined;
  applicationNumber?: string;
  ds: DS;
}) {
  const sm = SM[ds];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
        <div className="w-8 h-8 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Info className="w-4 h-4 text-slate-500" />
        </div>
        <h3 className="font-semibold text-slate-900">Application Info</h3>
      </div>

      <div className="px-6 py-5 space-y-1">
       {applicationNumber && (
  <InfoRow icon={Hash} label="Application Number">
    <span className="font-mono font-bold text-indigo-600 tracking-wide">
      {applicationNumber}
    </span>
  </InfoRow>
)}

        <InfoRow icon={Calendar} label="Applied on">
          {fmt(appliedAt) || "—"}
        </InfoRow>

        <InfoRow icon={Clock} label="Last updated" divider>
          {fmt(updatedAt) || "—"}
        </InfoRow>

        <InfoRow icon={Activity} label="Status" divider>
          <span className={`font-semibold ${sm.color}`}>{ds}</span>
        </InfoRow>

        {analysisStatus && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Activity className="w-4 h-4" />
              AI Analysis
            </span>
            <AnalysisStatusBadge status={analysisStatus} />
          </div>
        )}
      </div>
    </div>
  );
}