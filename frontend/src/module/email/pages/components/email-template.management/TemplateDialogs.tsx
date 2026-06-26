import { AlertTriangle, ToggleLeft, ToggleRight, Shield } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { EmailTemplate } from "@/module/email/types/email.types";

interface TemplateDialogsProps {
  deleteId: string | null;
  toggleTemplate: EmailTemplate | null;
  onDeleteClose: () => void;
  onToggleClose: () => void;
  onDeleteConfirm: () => void;
  onToggleConfirm: () => void;
}

export function TemplateDialogs({
  deleteId,
  toggleTemplate,
  onDeleteClose,
  onToggleClose,
  onDeleteConfirm,
  onToggleConfirm,
}: TemplateDialogsProps) {
  const isActive = toggleTemplate?.isActive;

  return (
    <>
      <AlertDialog open={!!deleteId} onOpenChange={onDeleteClose}>
        <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
          <div className="relative bg-linear-to-br from-rose-600 to-rose-700 px-8 pt-10 pb-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />

            <div className="relative flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                <AlertTriangle className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <AlertDialogTitle className="text-2xl font-bold text-white">
                Delete Template
              </AlertDialogTitle>
              <AlertDialogDescription className="text-rose-100 mt-2 text-base">
                This action cannot be undone.
              </AlertDialogDescription>
            </div>
          </div>

          <div className="px-8 py-8 space-y-6 bg-white">
            <div className="text-slate-600 text-[15px] leading-relaxed">
              Are you sure you want to permanently delete this email template?
              All associated data will be lost.
            </div>

            <AlertDialogFooter className="flex gap-3 pt-4">
              <AlertDialogCancel className="flex-1 h-12 rounded-2xl border-2 border-slate-200 hover:bg-slate-50 font-semibold">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteConfirm}
                className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 font-semibold text-white shadow-lg shadow-rose-600/30"
              >
                Yes, Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!toggleTemplate} onOpenChange={onToggleClose}>
        <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
          {/* Dark linear Header */}
          <div className="relative bg-linear-to-br from-slate-900 to-slate-800 px-8 pt-10 pb-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

            <div className="relative flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                {isActive ? (
                  <ToggleLeft
                    className="h-7 w-7 text-amber-400"
                    strokeWidth={2}
                  />
                ) : (
                  <ToggleRight
                    className="h-7 w-7 text-emerald-400"
                    strokeWidth={2}
                  />
                )}
              </div>
              <AlertDialogTitle className="text-2xl font-bold text-white">
                {isActive ? "Deactivate Template" : "Activate Template"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-300 mt-2 text-base">
                {isActive
                  ? "This template will stop being used in automated notifications."
                  : "This template will become available for use."}
              </AlertDialogDescription>
            </div>
          </div>

          <div className="px-8 py-8 bg-white">
            <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <Shield className="h-6 w-6 text-slate-400 mt-0.5 shrink-0" />
              <div className="text-sm text-slate-600 leading-relaxed">
                {isActive
                  ? "Deactivating this template will prevent it from being automatically sent. You can reactivate it anytime."
                  : "Once activated, this template can be used in your email workflows and notifications."}
              </div>
            </div>

            <AlertDialogFooter className="flex gap-3 pt-8">
              <AlertDialogCancel className="flex-1 h-12 rounded-2xl border-2 border-slate-200 hover:bg-slate-50 font-semibold">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onToggleConfirm}
                className={cn(
                  "flex-1 h-12 rounded-2xl font-semibold text-white shadow-lg",
                  isActive
                    ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30",
                )}
              >
                {isActive ? "Deactivate Template" : "Activate Template"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
