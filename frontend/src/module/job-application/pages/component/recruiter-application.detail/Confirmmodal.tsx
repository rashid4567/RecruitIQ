import { useState } from "react";
import { X } from "lucide-react";
import type { ModalConfig } from "./Index";

export function ConfirmModal({
  config,
  onConfirm,
  onCancel,
  loading,
}: {
  config: ModalConfig;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState("");
  const canSubmit = !config.requireReason || reason.trim().length >= 5;

  const accentColor = config.confirmClass.includes("red")
    ? "bg-red-500"
    : config.confirmClass.includes("blue")
      ? "bg-blue-500"
      : config.confirmClass.includes("emerald")
        ? "bg-emerald-500"
        : config.confirmClass.includes("amber")
          ? "bg-amber-400"
          : config.confirmClass.includes("violet")
            ? "bg-violet-500"
            : "bg-slate-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className={`h-1 w-full ${accentColor}`} />

        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${config.iconClass}`}
            >
              <config.Icon className="w-5 h-5" />
            </div>
            <div className="pt-0.5">
              <h2 className="text-base font-bold text-slate-900">
                {config.title}
              </h2>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                {config.description}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {(config.reasonLabel || config.reasonPlaceholder) && (
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {config.reasonLabel}
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={config.reasonPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5"
              />
            </div>
          )}

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!canSubmit || loading}
              onClick={() => onConfirm(reason || undefined)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${config.confirmClass}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                config.confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
