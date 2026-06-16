import { X, AlertTriangle, Loader2 } from "lucide-react";

interface WithdrawModalProps {
  jobTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function WithdrawModal({ jobTitle, onConfirm, onCancel, loading }: WithdrawModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-lg transition"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Withdraw application?</h3>
            <p className="text-xs text-slate-400 mt-0.5">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          You're about to withdraw your application for{" "}
          <span className="font-semibold text-slate-800">{jobTitle}</span>. You won't be able
          to re-apply for this position after withdrawing.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
          >
            Keep application
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}