import { useRef, useState } from "react";
import { UploadCloud, X, Loader2, FileText } from "lucide-react";
import { uploadResume } from "@/module/resume/api/resume.api";

interface UploadResumeModalProps {
  onClose: () => void;
  onUploaded: () => void;
}

export default function UploadResumeModal({
  onClose,
  onUploaded,
}: UploadResumeModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadResume(file);
      onUploaded();
    } catch (err) {
      console.error("Failed to upload resume:", err);
      setError("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-60 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-7">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Upload Your Resume</h3>
            <p className="mt-1 text-sm text-gray-500">
              Please upload a resume before applying to this job.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          onClick={() => inputRef.current?.click()}
          className="mt-5 w-full flex flex-col items-center justify-center gap-2 py-8 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
        >
          {file ? (
            <>
              <FileText className="w-7 h-7 text-indigo-500" />
              <span className="text-sm font-semibold text-gray-700 truncate max-w-56">
                {file.name}
              </span>
              <span className="text-xs text-gray-400">Click to choose a different file</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-7 h-7 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-600">
                Click to select a file
              </span>
              <span className="text-xs text-gray-400">PDF or Word, up to 5MB</span>
            </>
          )}
        </button>

        {error && (
          <p className="mt-3 text-xs font-medium text-red-500 text-center">{error}</p>
        )}

        <div className="mt-6 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all ${
              !file || uploading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200/50"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}