import { Loader2, Ban, CheckCircle, Briefcase } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { JobPostEntity } from "../../../domain/entities/jobpost.entity"

interface BlockConfirmDialogProps {
  job: JobPostEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function BlockConfirmDialog({
  job,
  isOpen,
  onClose,
  onConfirm,
  loading,
}: BlockConfirmDialogProps) {
  if (!job) return null;

  const isUnblocking = job.isBlocked;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
     <AlertDialogContent className="p-0 gap-0 rounded-2xl max-w-100 overflow-hidden border border-slate-200 shadow-xl bg-white text-slate-900">
        <div
          className={cn(
            "h-1 w-full",
            isUnblocking ? "bg-emerald-500" : "bg-rose-500"
          )}
        />

        <div className="px-6 pt-6 pb-5 space-y-5">
          <AlertDialogHeader className="space-y-0 p-0">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "mt-0.5 w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                  isUnblocking
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-rose-50 border border-rose-200"
                )}
              >
                {isUnblocking ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Ban className="w-5 h-5 text-rose-600" />
                )}
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <AlertDialogTitle className="text-[15px] font-semibold text-slate-900 leading-snug">
                  {isUnblocking ? "Unblock this job post?" : "Block this job post?"}
                </AlertDialogTitle>
                <AlertDialogDescription className="mt-1.5 text-[13px] text-slate-500 leading-relaxed">
                  {isUnblocking
                    ? "The listing will be visible to candidates again and resume accepting applications."
                    : "The listing will be hidden from all candidates immediately. You can unblock it at any time."}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-800 truncate leading-none">
                {job.title}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-none">
                {job.department}
              </p>
            </div>
            <span
              className={cn(
                "ml-auto shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full",
                isUnblocking
                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              )}
            >
              {isUnblocking ? "Blocked" : "Active"}
            </span>
          </div>
          <div className="border-t border-slate-100" />
          <AlertDialogFooter className="p-0 flex-row justify-end gap-2">
            <AlertDialogCancel
              disabled={loading}
              className="h-9 px-4 rounded-xl text-[13px] font-medium border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              disabled={loading}
              className={cn(
                "h-9 px-5 rounded-xl text-[13px] font-semibold min-w-24 gap-2 transition-all",
                isUnblocking
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                  : "bg-rose-600 hover:bg-rose-700 text-white border-0"
              )}
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isUnblocking ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Unblock post
                </>
              ) : (
                <>
                  <Ban className="w-3.5 h-3.5" />
                  Block post
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>

      </AlertDialogContent>
    </AlertDialog>
  );
}