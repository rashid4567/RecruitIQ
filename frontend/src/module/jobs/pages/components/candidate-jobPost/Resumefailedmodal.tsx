import { FileWarning } from "lucide-react";

interface ResumeFailedModalProps {
  onClose: () => void;
  onUploadAnother: () => void;
}

export default function ResumeFailedModal({
  onClose,
  onUploadAnother,
}: ResumeFailedModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-60 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-7 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
          <FileWarning className="w-6.5 h-6.5 text-red-500" />
        </div>

        <h3 className="mt-4 text-base font-bold text-gray-900">
          We couldn't analyze your resume
        </h3>
        <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
          This can happen if the document is corrupted or unreadable. Please
          upload another resume.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={onUploadAnother}
            className="w-full py-3 rounded-2xl text-sm font-bold bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200/50 transition-all"
          >
            Upload Another Resume
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl text-sm font-semibold text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}