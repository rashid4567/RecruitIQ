import { AlertTriangle } from "lucide-react";
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
import type { EmailTemplate } from "@/module/admin/domain/entities/email-template.entity";
import { cn } from "@/lib/utils";

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
  return (
    <>
      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={onDeleteClose}>
        <AlertDialogContent className="max-w-md rounded-2xl border-slate-200 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
              Delete Email Template
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="h-10 rounded-md border-slate-300 hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-10 bg-rose-600 hover:bg-rose-700 rounded-md"
              onClick={onDeleteConfirm}
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Dialog */}
      <AlertDialog
        open={!!toggleTemplate}
        onOpenChange={onToggleClose}
      >
        <AlertDialogContent className="max-w-md rounded-2xl border-slate-200 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">
              {toggleTemplate?.isActive() ? "Deactivate" : "Activate"} Template
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              {toggleTemplate?.isActive()
                ? "Deactivating will stop automatic sending of this template."
                : "Activating will allow this template to be used in notifications."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="h-10 rounded-md border-slate-300 hover:bg-slate-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "h-10 rounded-md",
                toggleTemplate?.isActive()
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              )}
              onClick={onToggleConfirm}
            >
              {toggleTemplate?.isActive() ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}