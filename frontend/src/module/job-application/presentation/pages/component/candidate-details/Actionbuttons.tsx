import { Download, MessageSquare, X, Loader2 } from "lucide-react";
import type { JobApplication } from "../../../../domain/entity/job-application.entity";

interface ActionButtonsProps {
  application: JobApplication;
  onWithdraw: () => void;
  downloadResume: (resumeId: string) => Promise<boolean>;
  downloadLoading: boolean;
}

export function ActionButtons({
  application,
  onWithdraw,
  downloadResume,
  downloadLoading,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => downloadResume(application.getResumeId())}
        disabled={downloadLoading}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60"
      >
        {downloadLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Download resume
      </button>

      <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all">
        <MessageSquare className="w-4 h-4" />
        Contact support
      </button>

      {!application.isWithdrawn() && !application.isSelected() && (
        <button
          onClick={onWithdraw}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 active:scale-[0.98] transition-all"
        >
          <X className="w-4 h-4" />
          Withdraw application
        </button>
      )}
    </div>
  );
}
