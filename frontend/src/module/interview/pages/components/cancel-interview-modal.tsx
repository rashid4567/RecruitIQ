import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";

interface CancelInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
  candidateName?: string;
}

const CANCEL_REASONS = [
  "Candidate requested cancellation",
  "Position no longer available",
  "Scheduling conflict",
  "Candidate withdrew application",
  "Other",
];

export default function CancelInterviewModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  error = null,
  candidateName,
}: CancelInterviewModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  if (!isOpen) return null;

  const finalReason =
    selectedReason === "Other" ? customReason.trim() : selectedReason;
  const canSubmit = finalReason.length > 0 && !loading;

  function handleClose() {
    if (loading) return;
    setSelectedReason("");
    setCustomReason("");
    onClose();
  }

  async function handleConfirm() {
    if (!canSubmit) return;
    await onConfirm(finalReason);
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-start gap-3 px-6 pt-6 pb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">
              Cancel Interview
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {candidateName
                ? `This will cancel the interview with ${candidateName}.`
                : "This will cancel the scheduled interview."}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-2 space-y-3">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Reason for cancellation
          </label>
          <div className="space-y-1.5">
            {CANCEL_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => setSelectedReason(reason)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                  selectedReason === reason
                    ? "border-red-300 bg-red-50 text-red-700 font-medium"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {reason}
              </button>
            ))}
          </div>

          {selectedReason === "Other" && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Please specify the reason…"
              rows={3}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 resize-none"
            />
          )}

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-slate-50 border-t border-slate-100 mt-4">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Keep Interview
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canSubmit}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Cancel Interview
          </button>
        </div>
      </div>
    </div>
  );
}
