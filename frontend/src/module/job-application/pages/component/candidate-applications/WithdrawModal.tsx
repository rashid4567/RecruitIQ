import React from "react";
import { Loader2, X, AlertTriangle } from "lucide-react";
import type { CandidateApplication } from "@/module/job-application/types/application.types";

interface Props {
  app: CandidateApplication;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const WithdrawModal: React.FC<Props> = ({
  app,
  onConfirm,
  onCancel,
  loading,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]"
    onClick={(e) => {
      if (e.target === e.currentTarget) onCancel();
    }}
  >
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-100 mx-4 overflow-hidden">
      <div className="h-1 bg-linear-to-r from-red-400 to-rose-500" />

      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                Withdraw Application
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-400 hover:text-slate-600 disabled:opacity-40"
          >
            <X size={15} />
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 mb-5">
          <p className="text-[12px] text-slate-500 mb-1 font-medium uppercase tracking-wide">
            Application
          </p>
          <p className="text-[14px] font-semibold text-slate-800 leading-snug">
            {app.jobId}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">ID: {app.applicationId}</p>
        </div>

        <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
          Withdrawing will notify the recruiter and remove this application from
          your active pipeline. You won't be able to reapply for the same
          position.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50"
          >
            Keep Application
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold text-white bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-xl transition shadow-sm shadow-red-200 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Withdrawing…
              </>
            ) : (
              "Yes, Withdraw"
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);
