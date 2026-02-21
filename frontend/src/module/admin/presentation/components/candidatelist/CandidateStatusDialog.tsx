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
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateStatusDialogProps {
  open: boolean;
  candidateName: string;
  action: "block" | "unblock";
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function CandidateStatusDialog({
  open,
  candidateName,
  action,
  loading,
  onOpenChange,
  onConfirm,
}: CandidateStatusDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl border-slate-200 shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-slate-900">
            {action === "block" ? "Block Candidate" : "Unblock Candidate"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-slate-600">
            Are you sure you want to {action} <span className="font-medium">{candidateName}</span>?
            {action === "block"
              ? " This will restrict their access to job notifications."
              : " This will restore their full access."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="h-10 rounded-md border-slate-300 hover:bg-slate-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "h-10 rounded-md",
              action === "block"
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            )}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}