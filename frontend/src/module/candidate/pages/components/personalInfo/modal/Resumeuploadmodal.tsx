import { useRef, useCallback } from "react";
import { X, Upload, File, CheckCircle2, AlertCircle, Trash2, Download } from "lucide-react";
import type { Resume } from "@/module/candidate/types/candidate.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResumeUploadModalProps {
  open: boolean;
  onClose: () => void;
  resume: Resume | null;
  isUploading: boolean;
  uploadProgress: number;
  isDeleting: boolean;
  isDownloading: boolean;
  error: string | null;
  onUpload: (file: File) => void;
  onDelete: () => void;
  onDownload: () => void;
  clearError: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ResumeUploadModal({
  open,
  onClose,
  resume,
  isUploading,
  uploadProgress,
  isDeleting,
  isDownloading,
  error,
  onUpload,
  onDelete,
  onDownload,
  clearError,
}: ResumeUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
      e.target.value = "";
    },
    [onUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) onUpload(file);
    },
    [onUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleClose = useCallback(() => {
    if (isUploading) return;
    clearError();
    onClose();
  }, [isUploading, clearError, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-150"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-150">

          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div>
              <h2
                id="resume-modal-title"
                className="text-base font-semibold text-slate-900"
              >
                Upload resume
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                PDF or Word document · max 5 MB
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 pb-6 space-y-4">

            {/* Drop zone (hidden while uploading or file already present) */}
            {!isUploading && !resume && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/40 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Upload className="h-5 w-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                </div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Drag & drop your file here
                </p>
                <p className="text-sm text-slate-400 mb-3">or</p>
                <span className="inline-block px-4 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  Browse files
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Select resume file"
                />
              </div>
            )}

            {/* Upload progress */}
            {isUploading && (
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <File className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate mb-1.5">
                    Uploading…
                  </p>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-slate-500 shrink-0">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
            )}

            {/* Uploaded file */}
            {resume && !isUploading && (
              <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3 border border-green-200">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-900 truncate">
                    {resume.fileName}
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Uploaded on{" "}
                    {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={onDownload}
                    disabled={isDownloading}
                    className="p-1.5 rounded-lg text-green-700 hover:bg-green-100 transition-colors disabled:opacity-40"
                    aria-label="Download resume"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="p-1.5 rounded-lg text-green-700 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-40"
                    aria-label="Delete resume"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Replace button (shown after upload) */}
            {resume && !isUploading && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 rounded-lg border border-dashed border-slate-200 text-sm text-slate-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/40 transition-colors"
              >
                Replace with a different file
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Replace resume file"
            />

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2.5 border border-red-200">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
              >
                {resume ? "Done" : "Cancel"}
              </button>
              {!resume && !isUploading && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
                >
                  Choose file
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}