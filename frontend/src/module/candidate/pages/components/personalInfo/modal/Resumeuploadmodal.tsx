import { useRef, useCallback } from "react";
import { X, Upload, FileText, RotateCw, AlertCircle } from "lucide-react";
import type { Resume } from "@/module/candidate/types/candidate.types";

interface ResumeUploadModalProps {
  open: boolean;
  onClose: () => void;
  resume: Resume | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  onUpload: (file: File) => void;
  clearError: () => void;
}

function formatUploadedDate(dateString: string) {
  const uploaded = new Date(dateString);
  const now = new Date();
  const isSameDay =
    uploaded.getFullYear() === now.getFullYear() &&
    uploaded.getMonth() === now.getMonth() &&
    uploaded.getDate() === now.getDate();

  if (isSameDay) return "Uploaded today";

  return `Uploaded ${uploaded.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

export function ResumeUploadModal({
  open,
  onClose,
  resume,
  isUploading,
  uploadProgress,
  error,
  onUpload,
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
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-150"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-black/10 w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div>
              <h2
                id="resume-modal-title"
                className="text-base font-semibold text-slate-900"
              >
                Resume
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Upload or replace your resume
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PDF • DOC • DOCX • Max 5 MB
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="w-8 h-8 shrink-0 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-amber-50 hover:text-slate-600 hover:border-amber-200 transition-colors disabled:opacity-40"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-6 pb-6 space-y-5">
            {/* Empty state / drop zone */}
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
                  Drop your resume here
                </p>
                <p className="text-sm text-slate-400 mb-1">
                  or click to browse
                </p>
                <p className="text-xs text-slate-400">
                  PDF • DOC • DOCX
                </p>
                <p className="text-xs text-slate-400">Max 5 MB</p>
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

            {/* Uploading state */}
            {isUploading && (
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate mb-1.5">
                    Uploading…
                  </p>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-slate-500 shrink-0">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
            )}

            {/* Resume file card */}
            {resume && !isUploading && (
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {resume.fileName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatUploadedDate(resume.uploadedAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Replace button */}
            {resume && !isUploading && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-amber-300 text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
              >
                <RotateCw className="h-4 w-4 text-amber-500" />
                Replace Resume
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

            {error && (
              <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2.5 border border-red-200">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Footer actions */}
            <div className="pt-1">
              {resume ? (
                <button
                  onClick={handleClose}
                  disabled={isUploading}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors disabled:opacity-40"
                >
                  Done
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    disabled={isUploading}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  {!isUploading && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
                    >
                      Choose file
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}